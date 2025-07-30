import { Telegraf, Context, Markup } from "telegraf";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { PostHog } from "posthog-node";

interface BotContext extends Context {
    session: {
        selectedWorkflow?: any;
    };
}

export class TokenMonitorService {
    private bot: Telegraf<BotContext>;
    private prisma: PrismaClient;
    private analytics: PostHog;
    private monitoringInterval: NodeJS.Timeout | null = null;
    private API_BASE_URL = "https://api-flowweave.vesala.xyz/api/token-price";
    private testPrices: Map<string, number> = new Map();
    private initialPrices: Map<string, { price: number, isAboveTarget: boolean }> = new Map();

    constructor(bot: Telegraf<BotContext>) {
        console.log("[TokenMonitorService] Initializing with bot context");
        this.bot = bot;
        this.prisma = new PrismaClient();
        this.analytics = new PostHog(process.env.POSTHOG_API_KEY!, {
            host: "https://us.i.posthog.com"
        });
        this.initializeMonitors();
        this.setupCallbackHandlers();
    }

    private setupCallbackHandlers() {
        console.log("[TokenMonitorService] Setting up callback handlers");
        // Handle stop monitoring button clicks
        this.bot.action(/^stop_monitor:(.+)$/, async (ctx) => {
            try {
                console.log("[TokenMonitorService] Handling stop_monitor action");
                const token = ctx.match[1];
                const chatId = ctx.chat?.id.toString() || "";
                console.log(`[TokenMonitorService] Stop monitor request for token: ${token}, chatId: ${chatId}`);
                
                await this.stopPriceMonitor(chatId, token);
                await ctx.answerCbQuery(`Stopped monitoring ${token}`);
                await ctx.editMessageText(
                    `✅ Monitoring stopped for ${token}`,
                    { reply_markup: undefined }
                );
            } catch (error) {
                console.error("[TokenMonitorService] Error handling stop monitor callback:", error);
                await ctx.answerCbQuery("Failed to stop monitoring. Please try again.");
            }
        });
    }

    private async initializeMonitors() {
        try {
            if (this.monitoringInterval) {
                clearInterval(this.monitoringInterval);
            }

            this.monitoringInterval = setInterval(async () => {
                try {
                    console.log('[TokenMonitorService] Checking active monitors...');
                    const activeMonitors = await this.prisma.tokenMonitor.findMany({
                        where: { isActive: true }
                    });
                    console.log(`[TokenMonitorService] Found ${activeMonitors.length} active monitors to check`);

                    for (const monitor of activeMonitors) {
                        try {
                            const price = await this.getTokenPrice(monitor.token);
                            console.log(`[TokenMonitorService] Current price for ${monitor.token}: $${price}`);
                            
                            // Create inline keyboard with both Stop Monitoring and View Monitored Tokens buttons
                            const inlineKeyboard = Markup.inlineKeyboard([
                                [
                                    Markup.button.callback('🛑 Stop Monitoring', `stop_monitor:${monitor.token}`),
                                    Markup.button.callback('📊 View All Monitors', 'view_monitors')
                                ]
                            ]);

                            // Only send regular updates if there's no target price (not a price alert)
                            if (!monitor.targetPrice) {
                                await this.bot.telegram.sendMessage(
                                    monitor.chatId,
                                    `💰 Current price of ${monitor.token}: $${price}`,
                                    { reply_markup: inlineKeyboard.reply_markup }
                                );
                            }
                            // Check price alerts
                            else if (monitor.targetPrice) {
                                const monitorKey = `${monitor.chatId}_${monitor.token}`;
                                const initialState = this.initialPrices.get(monitorKey);

                                if (initialState) {
                                    const { isAboveTarget } = initialState;
                                    const shouldAlert = isAboveTarget ? 
                                        price >= monitor.targetPrice : 
                                        price <= monitor.targetPrice;

                                    if (shouldAlert) {
                                        const direction = isAboveTarget ? 'above' : 'below';
                                        await this.bot.telegram.sendMessage(
                                            monitor.chatId,
                                            `🚨 Alert: ${monitor.token} has reached $${price}, ${direction} your target of $${monitor.targetPrice}!`,
                                            { reply_markup: inlineKeyboard.reply_markup }
                                        );
                                        // Deactivate the monitor after alert is triggered
                                        await this.stopPriceMonitor(monitor.chatId, monitor.token);
                                        // Clean up the initial price data
                                        this.initialPrices.delete(monitorKey);
                                    }
                                }
                            }
                        } catch (error) {
                            console.error(`[TokenMonitorService] Error checking price for ${monitor.token}:`, error);
                        }
                    }
                } catch (error) {
                    console.error("[TokenMonitorService] Error in monitoring interval:", error);
                }
            }, 10000); // Check every 10 seconds
        } catch (error) {
            console.error("[TokenMonitorService] Error initializing monitors:", error);
        }
    }

    async getSupportedTokens(): Promise<string[]> {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/supported`);
            return response.data.supportedTokens;
        } catch (error) {
            console.error("Error fetching supported tokens:", error);
            throw error;
        }
    }

    // Test methods for simulating price changes
    async setTestPrice(token: string, price: number) {
        console.log(`[TokenMonitorService] Setting test price for ${token}: $${price}`);
        this.testPrices.set(token.toLowerCase(), price);
        return true;
    }

    async getTokenPrice(token: string): Promise<number> {
        try {
            // Check for test price first
            const testPrice = this.testPrices.get(token.toLowerCase());
            if (testPrice !== undefined) {
                return testPrice;
            }

            // If no test price, use real API
            const response = await axios.get(`${this.API_BASE_URL}?token=${token}`);
            return parseFloat(response.data.price);
        } catch (error) {
            console.error(`Error fetching price for ${token}:`, error);
            throw error;
        }
    }

    async getUserMonitors(chatId: string) {
        console.log(`[TokenMonitorService] Getting monitors for chatId: ${chatId}`);
        try {
            const monitors = await this.prisma.tokenMonitor.findMany({
                where: { 
                    chatId,
                    isActive: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    token: true,
                    targetPrice: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            console.log('[TokenMonitorService] Raw monitors from DB:', JSON.stringify(monitors, null, 2));
            console.log(`[TokenMonitorService] Found ${monitors.length} active monitors`);
            return monitors;
        } catch (error) {
            console.error("[TokenMonitorService] Error fetching user monitors:", error);
            throw error;
        }
    }

    async startPriceMonitor(token: string, chatId: string, targetPrice?: number): Promise<boolean> {
        try {
            console.log(`[TokenMonitorService] Starting price monitor for token: ${token}, chatId: ${chatId}`);
            // Check if monitor already exists
            const existingMonitor = await this.prisma.tokenMonitor.findUnique({
                where: {
                    chatId_token: {
                        chatId,
                        token
                    }
                }
            });
            console.log('[TokenMonitorService] Existing monitor:', existingMonitor);

            if (existingMonitor && existingMonitor.isActive) {
                throw new Error("Token is already being monitored");
            }

            // Create or update the monitor in the database
            const monitor = await this.prisma.tokenMonitor.upsert({
                where: {
                    chatId_token: {
                        chatId,
                        token
                    }
                },
                update: {
                    isActive: true,
                    targetPrice: targetPrice || null,
                    updatedAt: new Date()
                },
                create: {
                    chatId,
                    token,
                    targetPrice: targetPrice || null,
                    isActive: true
                }
            });
            console.log('[TokenMonitorService] Monitor created/updated:', monitor);

            // Capture workflow trigger event
            this.analytics.capture({
                distinctId: chatId,
                event: 'Workflow Triggered',
                properties: {
                    workflow_type: 'token_monitor',
                    token: token,
                    has_target_price: !!targetPrice,
                    target_price: targetPrice || undefined
                }
            });

            return true;
        } catch (error) {
            console.error("[TokenMonitorService] Error starting price monitor:", error);
            throw error;
        }
    }

    async setPriceAlert(token: string, targetPrice: number, chatId: string): Promise<boolean> {
        try {
            // Get current price to determine monitoring direction
            const currentPrice = await this.getTokenPrice(token);
            const isAboveTarget = currentPrice > targetPrice;

            // Store initial price and comparison direction
            const monitorKey = `${chatId}_${token}`;
            this.initialPrices.set(monitorKey, {
                price: currentPrice,
                isAboveTarget
            });

            // Create or update the monitor with a target price
            await this.startPriceMonitor(token, chatId, targetPrice);
            
            // Capture workflow trigger event
            this.analytics.capture({
                distinctId: chatId,
                event: 'Workflow Triggered',
                properties: {
                    workflow_type: 'price_alert',
                    token: token,
                    target_price: targetPrice,
                    initial_price: currentPrice,
                    monitoring_direction: isAboveTarget ? 'waiting_for_above' : 'waiting_for_below'
                }
            });

            return true;
        } catch (error) {
            console.error("Error setting price alert:", error);
            throw error;
        }
    }

    async stopPriceMonitor(chatId: string, token: string): Promise<boolean> {
        try {
            // Update the database
            await this.prisma.tokenMonitor.update({
                where: {
                    chatId_token: {
                        chatId,
                        token
                    }
                },
                data: {
                    isActive: false,
                    updatedAt: new Date()
                }
            });

            // Clean up initial price data
            const monitorKey = `${chatId}_${token}`;
            this.initialPrices.delete(monitorKey);

            return true;
        } catch (error) {
            console.error("Error stopping price monitor:", error);
            throw error;
        }
    }

    // Clean up method to be called when shutting down the bot
    cleanup() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
    }
} 