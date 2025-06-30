import { Telegraf } from "telegraf";
import { PrismaClient } from "@prisma/client";
import { GoogleCalendarService } from "./google-calendar.service";

export class DiscordEventCalendarService {
    private bot: any;
    private prisma: PrismaClient;
    private calendarService: GoogleCalendarService;

    constructor(bot: any) {
        this.bot = bot;
        this.prisma = new PrismaClient();
        this.calendarService = new GoogleCalendarService();
    }

    /**
     * Initialize calendar sync for a user
     */
    async initializeCalendarSync(
        telegramChatId: string,
        telegramUsername: string
    ): Promise<string> {
        try {
            // Use a simple string format instead of JSON to avoid encoding issues
            const stateData = `${telegramChatId}:${telegramUsername}`;
            const authUrl = this.calendarService.getAuthUrl(stateData);

            // No database operations here - subscription should already exist from Discord command
            // We just provide the OAuth URL for calendar authorization

            return authUrl;
        } catch (error) {
            console.error("Error initializing calendar sync:", error);
            throw new Error("Failed to initialize calendar sync");
        }
    }

    /**
     * Handle OAuth callback and complete setup
     */
    async handleOAuthCallback(code: string, state: string): Promise<boolean> {
        try {
            // Parse state data to get chat ID and username
            let telegramChatId: string;
            let telegramUsername: string;

            if (state.includes(":")) {
                // New format: "chatId:username"
                const [chatId, username] = state.split(":");
                telegramChatId = chatId;
                telegramUsername = username;
            } else {
                // Try parsing as JSON (legacy format)
                try {
                    const stateData = JSON.parse(state);
                    telegramChatId = stateData.telegramChatId;
                    telegramUsername = stateData.telegramUsername;
                } catch {
                    // Fallback for old format where state was just chat ID
                    telegramChatId = state;
                    telegramUsername = "";
                }
            }

            // Exchange code for tokens
            const tokens = await this.calendarService.exchangeCodeForTokens(
                code
            );

            // Get user's primary calendar with write access
            this.calendarService.setCredentials(
                tokens.accessToken,
                tokens.refreshToken
            );
            const primaryCalendar =
                await this.calendarService.getPrimaryCalendar();

            if (!primaryCalendar) {
                throw new Error("No writable calendar found for user");
            }

            // Debug: Check existing subscriptions
            console.log("🔍 Looking for subscriptions with:");
            console.log("   • telegramChatId:", telegramChatId);
            console.log("   • telegramUsername:", telegramUsername);

            // First try to find by both telegramChatId and telegramUsername
            let existingSubscriptions =
                await this.prisma.discordEventSubscription.findMany({
                    where: {
                        telegramChatId: telegramChatId,
                        telegramUsername: telegramUsername,
                    },
                });

            console.log(
                `📋 Found ${existingSubscriptions.length} subscription(s) by chatId + username`
            );

            // If no match, try finding by telegramUsername only (Discord creates records without telegramChatId)
            if (existingSubscriptions.length === 0) {
                console.log("🔍 Searching by telegramUsername only...");
                existingSubscriptions =
                    await this.prisma.discordEventSubscription.findMany({
                        where: {
                            telegramUsername: telegramUsername,
                            telegramChatId: null, // Discord records have null telegramChatId
                        },
                    });
                console.log(
                    `📋 Found ${existingSubscriptions.length} subscription(s) by username only`
                );
            }

            if (existingSubscriptions.length > 0) {
                console.log("📋 Subscription details:", existingSubscriptions);
            }

            // Update existing subscription(s) with OAuth tokens and calendar info
            const updateResult =
                await this.prisma.discordEventSubscription.updateMany({
                    where: {
                        telegramUsername: telegramUsername,
                        OR: [
                            { telegramChatId: telegramChatId },
                            { telegramChatId: null }, // Also update records with null telegramChatId
                        ],
                    },
                    data: {
                        telegramChatId: telegramChatId, // Set the correct telegramChatId
                        googleCalendarId: primaryCalendar.id,
                        googleAccessToken: tokens.accessToken,
                        googleRefreshToken: tokens.refreshToken,
                        syncToCalendar: true,
                        updatedAt: new Date(),
                    },
                });

            console.log(
                `📝 Updated ${updateResult.count} subscription(s) with calendar info`
            );

            if (updateResult.count === 0) {
                // No subscription found - user needs to run Discord commands first
                await this.bot.telegram.sendMessage(
                    telegramChatId,
                    `⚠️ **Almost there!**\n\n` +
                        `Your Google Calendar is authorized, but you need to subscribe to Discord events first.\n\n` +
                        `📋 **Next steps:**\n` +
                        `1. Go to your Discord server\n` +
                        `2. Admin: Use \`/setup-event-monitoring\` (if not done already)\n` +
                        `3. You: Use \`/calendar-sync telegram-username:${telegramUsername}\`\n` +
                        `4. Events will then sync to your calendar automatically!\n\n` +
                        `💡 Your Google Calendar authorization is saved and ready to use.`
                );
                return true;
            }

            // Send confirmation to Telegram
            await this.bot.telegram.sendMessage(
                telegramChatId,
                `✅ **Google Calendar Connected Successfully!**\n\n` +
                    `📅 Calendar: ${primaryCalendar.summary}\n` +
                    `🔗 Updated ${updateResult.count} subscription(s)\n\n` +
                    `🎉 **You're all set!** Discord events will now automatically sync to your Google Calendar.\n\n` +
                    `💡 **What happens next:**\n` +
                    `• All Discord events from your subscribed servers will appear in your calendar\n` +
                    `• You'll get reminders 30 minutes before each event\n` +
                    `• Real-time notifications via Telegram\n\n` +
                    `⚙️ Use \`/list-event-subscriptions\` in Discord to view all your subscriptions.`
            );

            return true;
        } catch (error) {
            console.error("Error handling OAuth callback:", error);

            // Send error message to user if possible
            try {
                let telegramChatId: string;

                if (state.includes(":")) {
                    // New format: "chatId:username"
                    telegramChatId = state.split(":")[0];
                } else {
                    // Try parsing as JSON (legacy format)
                    try {
                        const stateData = JSON.parse(state);
                        telegramChatId = stateData.telegramChatId;
                    } catch {
                        // Fallback: assume state is just the chat ID
                        telegramChatId = state;
                    }
                }

                await this.bot.telegram.sendMessage(
                    telegramChatId,
                    `❌ **Setup Failed**\n\n` +
                        `There was an error connecting your Google Calendar. Please try again with \`/execute_calendar_sync\`.\n\n` +
                        `💡 If this keeps happening, try revoking Google Calendar access in your Google Account settings and authorize again.`
                );
            } catch (e) {
                console.error("Failed to send error message to user:", e);
            }

            return false;
        }
    }

    /**
     * Get user's calendar sync status
     */
    async getUserSyncStatus(telegramChatId: string): Promise<any> {
        return await this.prisma.discordEventSubscription.findMany({
            where: {
                telegramChatId: telegramChatId,
                isActive: true,
            },
            include: {
                eventMonitor: true,
            },
        });
    }

    /**
     * Setup webhook endpoint for OAuth callback
     */
    setupOAuthWebhook() {
        // This will be handled by Express middleware
        console.log(
            "OAuth webhook endpoints should be configured in Express server"
        );
    }

    async startPolling(): Promise<void> {
        console.log("Discord Event Calendar Service started");
        this.setupOAuthWebhook();
    }

    async cleanup(): Promise<void> {
        await this.prisma.$disconnect();
    }
}
