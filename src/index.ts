import { Telegraf, Context, session } from "telegraf";
import { message } from "telegraf/filters";
import { Update, Message } from "telegraf/types";
import { config } from "dotenv";
import { Workflow, WorkflowType } from "./types/workflow";
import { ArweaveService } from "./services/arweave.service";
import { TwitterService } from "./services/twitter.service";
import { DiscordEventCalendarService } from "./services/discord-event-calendar.service";
import { TokenMonitorService } from "./services/token-monitor.service";
import { startOAuthServer } from "./oauth-server";
import { PostHog } from "posthog-node";
import { PrismaClient } from "@prisma/client";

// Load environment variables
config();

// Initialize PostHog
const analytics = new PostHog(process.env.POSTHOG_API_KEY!, {
    host: "https://us.i.posthog.com",
});

// Initialize Prisma for Discord notifications
const prisma = new PrismaClient();

interface BotContext extends Context {
    session: {
        selectedWorkflow?: Workflow;
        twitterUsername?: string;
    };
}

const bot = new Telegraf<BotContext>(process.env.TELEGRAM_BOT_TOKEN!);

// Add session middleware
bot.use(session());

// Initialize services
const arweaveService = new ArweaveService(bot);
const twitterService = new TwitterService(bot);
const tokenMonitorService = new TokenMonitorService(bot);
let discordEventCalendarService: DiscordEventCalendarService;

// Initialize the services when the bot starts
let servicesInitialized = false;

async function initializeServices() {
    if (!servicesInitialized) {
        try {
            await arweaveService.startPolling().catch((error) => {
                console.error("Error in Arweave service polling:", error);
            });
            await twitterService.startPolling().catch((error) => {
                console.error("Error in Twitter service polling:", error);
            });
            servicesInitialized = true;
        } catch (error) {
            console.error("Failed to initialize services:", error);
            throw error;
        }
    }
}

// Sample workflows
const availableWorkflows: Workflow[] = [
    {
        id: "arweave",
        name: "Arweave Upload",
        description:
            "Upload media files (images, documents, etc.) to Arweave and receive a notification with a link to the uploaded file",
        type: WorkflowType.ARWEAVE_UPLOAD,
    },
    {
        id: "twitter",
        name: "Twitter Monitor",
        description:
            "Monitor a Twitter account for new posts and receive notifications",
        type: WorkflowType.TWITTER_MONITOR,
    },
    {
        id: "discord",
        name: "Discord Notifications",
        description: "Receive notifications from monitored Discord channels",
        type: WorkflowType.DISCORD_MONITOR,
    },
    {
        id: "calendar_sync",
        name: "Discord Event Sync",
        description:
            "Automatically sync Discord events to your Google Calendar with reminders",
        type: WorkflowType.DISCORD_EVENT_CALENDAR_SYNC,
    },
    {
        id: "token_monitor",
        name: "Token Monitor",
        description:
            "Monitor token prices and get notifications for price alerts",
        type: WorkflowType.TOKEN_MONITOR,
    },
];

// Helper function to escape special characters for MarkdownV2
function escapeMarkdown(text: string): string {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

// Command to start the bot
bot.command("start", async (ctx: BotContext) => {
    try {
        // Initialize session
        ctx.session = {};

        // Get the help message by calling the help command handler
        const baseMessage =
            "🎉 Welcome to Flowweave Bot\\! 🚀\n\n" +
            "🤖 About Flowweave:\n" +
            "Flowweave is your all\\-in\\-one automation bot that helps you manage workflows across different platforms seamlessly\\.\n\n" +
            "📞 Our Socials:\n" +
            "• Website: [flowweave\\.ar\\.io](https://flowweave\\.ar\\.io)\n" +
            "• Discord: [Join our server](https://discord\\.gg/XT2D9k53Nk)\n" +
            "• GitHub: [flowweave](https://github\\.com/fluid-labs)\n\n";

        // Capture bot start event
        analytics.capture({
            distinctId: ctx.from?.id?.toString() || "unknown",
            event: "Bot_started",
            properties: {
                action: "start_bot",
                username: ctx.from?.username,
                firstName: ctx.from?.first_name,
                lastName: ctx.from?.last_name,
            },
        });

        // Send the welcome message with a button to view workflows
        await ctx.reply(baseMessage, {
            parse_mode: "MarkdownV2",
            link_preview_options: { is_disabled: true },
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📋 Workflow List", callback_data: "show_workflows" }]
                ]
            }
        });
    } catch (error) {
        console.error("Error in start command:", error);
        await ctx.reply("Sorry, there was an error starting the bot\\. Please try again\\.");
    }
});

// Command to register Discord account for notifications
bot.command("register_discord", async (ctx: BotContext) => {
    try {
        const telegramUsername = ctx.from?.username;
        const chatId = ctx.chat?.id?.toString();

        if (!telegramUsername) {
            await ctx.reply(
                "❌ You need to set a Telegram username first! Go to Settings → Username in Telegram."
            );
            return;
        }

        if (!chatId) {
            await ctx.reply("❌ Could not get your chat ID. Please try again.");
            return;
        }

        // Update all Discord subscriptions for this Telegram username with the Chat ID
        const updatedSubscriptions =
            await prisma.discordSubscription.updateMany({
                where: {
                    telegramUsername: telegramUsername,
                    isActive: true,
                },
                data: {
                    telegramChatId: chatId,
                },
            });

        if (updatedSubscriptions.count === 0) {
            await ctx.reply(
                `✅ Your Telegram account (@${telegramUsername}) is now registered for Discord notifications!\n\n` +
                    `💡 To receive notifications:\n` +
                    `1. Go to your Discord server\n` +
                    `2. Use the command: /subscribe channel:#your-channel telegram:${telegramUsername}\n` +
                    `3. You'll receive notifications here when messages are posted!`
            );
        } else {
            await ctx.reply(
                `✅ Successfully linked your Telegram account!\n\n` +
                    `🔗 **Updated ${updatedSubscriptions.count} Discord subscription(s)**\n` +
                    `📱 Username: @${telegramUsername}\n` +
                    `📬 You'll now receive Discord notifications here!\n\n` +
                    `💡 Test it by posting a message in your monitored Discord channels.`
            );
        }

        // Analytics
        analytics.capture({
            distinctId: ctx.from?.id?.toString() || "unknown",
            event: "Discord_account_registered",
            properties: {
                telegramUsername: telegramUsername,
                subscriptionsUpdated: updatedSubscriptions.count,
            },
        });
    } catch (error) {
        console.error("Error registering Discord account:", error);
        await ctx.reply(
            "❌ Sorry, there was an error registering your Discord account. Please try again."
        );
    }
});

// Command to list available workflows
bot.command("workflows", async (ctx: BotContext) => {
    try {
        const message = "🔧 *Available Workflows*\n\nSelect a workflow to get started:";
        
        // Create buttons in a 2x2 grid
        const buttons = [];
        for (let i = 0; i < availableWorkflows.length; i += 2) {
            const row = [];
            // Add first button in the row
            row.push({
                text: availableWorkflows[i].name,
                callback_data: `execute_${availableWorkflows[i].id}`
            });
            // Add second button if it exists
            if (i + 1 < availableWorkflows.length) {
                row.push({
                    text: availableWorkflows[i + 1].name,
                    callback_data: `execute_${availableWorkflows[i + 1].id}`
                });
            }
            buttons.push(row);
        }

        // Initialize session
        ctx.session = {};
        await ctx.reply(message, {
            parse_mode: "MarkdownV2",
            link_preview_options: { is_disabled: true },
            reply_markup: {
                inline_keyboard: buttons
            }
        });
    } catch (error) {
        console.error("Error listing workflows:", error);
        await ctx.reply("Sorry, there was an error listing the workflows\\. Please try again\\.");
    }
});

// About us command
bot.command("about", async (ctx: BotContext) => {
    try {
        const aboutMessage =
        "🎉 *Welcome to Flowweave Bot\\!* 🚀\n\n" +
        "🤖 *About Flowweave:*\n" +
        "Flowweave is your all\\-in\\-one automation bot that helps you manage workflows across different platforms seamlessly\\.\n\n" +
        "📞 *Our Socials:*\n" +
        "• [Website](https://flowweave\\.ar\\.io)\n" +
        "• [Discord Server](https://discord\\.gg/XT2D9k53Nk)\n" +
        "• [GitHub](https://github\\.com/fluid\\-labs)\n\n";

        await ctx.reply(aboutMessage, {
            parse_mode: "MarkdownV2",
            link_preview_options: { is_disabled: true }
        });
    } catch (error) {
        console.error("Error sending help message:", error);
        await ctx.reply(
            "Sorry, there was an error displaying the help message. Please try again."
        );
    }
});

// Command to setup Discord event calendar sync
bot.command("execute_calendar_sync", async (ctx: BotContext) => {
    try {
        const telegramUsername = ctx.from?.username;
        const chatId = ctx.chat?.id?.toString();

        if (!telegramUsername) {
            await ctx.reply(
                "❌ You need to set a Telegram username first! Go to Settings → Username in Telegram."
            );
            return;
        }

        if (!chatId) {
            await ctx.reply("❌ Could not get your chat ID. Please try again.");
            return;
        }

        // Initialize Discord Event Calendar Service if not already done
        if (!discordEventCalendarService) {
            discordEventCalendarService = new DiscordEventCalendarService(bot);
        }

        // Get the real OAuth URL
        const authUrl =
            await discordEventCalendarService.initializeCalendarSync(
                chatId,
                telegramUsername
            );

        const message =
            "🗓️ *Discord Event Calendar Sync Setup*\n\n" +
            "This workflow will automatically sync Discord events to your Google Calendar\\!\n\n" +
            "📋 *Setup Steps:*\n" +
            "1\\. *Discord Admin:* Use `/setup\\-event\\-monitoring`\n" +
            "2\\. *You:* Use `/calendar\\-sync @" + telegramUsername + "`\n" +
            "3\\. Click the authorization link below\n" +
            "4\\. Grant calendar access permissions\n" +
            "5\\. Done\\! Events will sync automatically\n\n" +
            "🔗 *Connect Google Calendar:*\n" +
            `[Click here to authorize](${authUrl})\n\n` +
            "💡 *Important:* Complete steps 1\\-2 in Discord first\\!\n\n" +
            "✨ *Features:*\n" +
            "• Auto\\-sync Discord events\n" +
            "• 30\\-min event reminders\n" +
            "• Real\\-time notifications\n" +
            "• Multi\\-server support";

        await ctx.reply(message, {
            parse_mode: "MarkdownV2",
            link_preview_options: { is_disabled: true }
        });

        // Analytics
        analytics.capture({
            distinctId: ctx.from?.id?.toString() || "unknown",
            event: "Calendar_sync_initiated",
            properties: {
                telegramUsername: telegramUsername,
                chatId: chatId,
            },
        });
    } catch (error) {
        console.error("Error setting up calendar sync:", error);
        await ctx.reply(
            "❌ Sorry, there was an error setting up calendar sync. Please try again."
        );
    }
});

// Handle workflow execution commands
availableWorkflows.forEach((workflow) => {
    bot.command(`execute_${workflow.id}`, async (ctx: BotContext) => {
        try {
            if (workflow.type === WorkflowType.ARWEAVE_UPLOAD) {
                await initializeServices();
                // Store the user's chat ID for notifications
                if (ctx.chat?.id) {
                    arweaveService.setUserChatId(ctx.chat.id.toString());
                } else {
                    throw new Error("Chat ID not found");
                }
                await ctx.reply(
                    `You've selected the ${workflow.name} workflow. Please send your media file (image, document, etc.) to @aogen_bot.`
                );
            } else if (workflow.type === WorkflowType.TWITTER_MONITOR) {
                await initializeServices();
                await ctx.reply(
                    "Please enter the Twitter username you want to monitor (without the @ symbol):"
                );
                ctx.session = { selectedWorkflow: workflow };
            } else if (
                workflow.type === WorkflowType.DISCORD_EVENT_CALENDAR_SYNC
            ) {
                // This is handled by the dedicated command above
                await ctx.reply(
                    "Please use /execute_calendar_sync to setup Discord event calendar sync."
                );
            } else if (workflow.type === WorkflowType.TOKEN_MONITOR) {
                await initializeServices();
                await ctx.reply(
                    "Please select a token to monitor from the list."
                );
                ctx.session = { selectedWorkflow: workflow };
            }
        } catch (error) {
            console.error("Error initializing workflow:", error);
            await ctx.reply(
                "Sorry, there was an error initializing the workflow. Please try again."
            );
        }
    });
});

// Command to stop monitoring a Twitter account
bot.command("stop_twitter", async (ctx: BotContext) => {
    try {
        await ctx.reply(
            "Please enter the Twitter username you want to stop monitoring (without the @ symbol):"
        );
        ctx.session = {
            selectedWorkflow: {
                id: "twitter_stop",
                name: "Stop Twitter Monitor",
                description: "Stop monitoring a Twitter account",
                type: WorkflowType.TWITTER_MONITOR,
            },
        };
    } catch (error) {
        console.error("Error stopping Twitter monitor:", error);
        await ctx.reply("Sorry, there was an error. Please try again.");
    }
});

// Handle text messages
bot.on("message", async (ctx) => {
    // Only handle text messages that aren't commands
    if ("text" in ctx.message && !ctx.message.text.startsWith("/")) {
        const selectedWorkflow = ctx.session?.selectedWorkflow;

        if (selectedWorkflow?.type === WorkflowType.TWITTER_MONITOR) {
            try {
                const username = ctx.message.text.trim().replace("@", "");
                const chatId = ctx.chat.id.toString();

                if (selectedWorkflow.id === "twitter_stop") {
                    await twitterService.removeMonitor(username, chatId);
                } else {
                    await twitterService.addMonitor(username, chatId);
                }
            } catch (error) {
                console.error("Error handling Twitter workflow:", error);
                await ctx.reply(
                    "Sorry, there was an error processing your request. Please try again."
                );
            } finally {
                // Clear the session
                ctx.session = {};
            }
        } else if (selectedWorkflow?.id === "token_alert" && selectedWorkflow.params?.token) {
            try {
                const targetPrice = parseFloat(ctx.message.text);
                
                if (isNaN(targetPrice) || targetPrice <= 0) {
                    await ctx.reply(
                        "❌ Please enter a valid positive number for the target price\\.",
                        { parse_mode: "MarkdownV2" }
                    );
                    return;
                }

                const chatId = ctx.chat.id.toString();
                const escapedToken = selectedWorkflow.params.token.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                const escapedPrice = targetPrice.toFixed(4).replace(/\./g, '\\.');
                await tokenMonitorService.setPriceAlert(selectedWorkflow.params.token, targetPrice, chatId);
                
                await ctx.reply(
                    `✅ Alert set\\! You will be notified when *${escapedToken}* reaches $${escapedPrice}\\!`,
                    { parse_mode: "MarkdownV2" }
                );
            } catch (error) {
                console.error("Error setting price alert:", error);
                await ctx.reply(
                    "Sorry, there was an error setting the price alert\\. Please try again\\.",
                    { parse_mode: "MarkdownV2" }
                );
            } finally {
                // Clear the session
                ctx.session = {};
            }
        } else if (selectedWorkflow) {
            // If a workflow is selected, show the media-only message
            await ctx.reply(
                "This workflow only supports media files (images, documents, etc.). Please send a media file to @aogen_bot or use /workflows to select a different workflow."
            );
        } else {
            // If no workflow is selected, guide the user to select one
            await ctx.reply(
                "Please use /workflows to see available workflows and select one to get started."
            );
        }
    }
});

// Handle media messages
bot.on(message("photo"), (ctx) => handleMediaMessage(ctx, "photo"));
bot.on(message("document"), (ctx) => handleMediaMessage(ctx, "document"));
bot.on(message("video"), (ctx) => handleMediaMessage(ctx, "video"));
bot.on(message("audio"), (ctx) => handleMediaMessage(ctx, "audio"));

// Helper function to handle media messages
async function handleMediaMessage<T extends Context<Update> & { session?: { selectedWorkflow?: Workflow } }>(ctx: T, type: string) {
    if (!ctx.session?.selectedWorkflow) {
        await ctx.reply("Please select a workflow first using /workflows");
        return;
    }

    try {
        await ctx.reply(
            `Processing your ${type} with ${ctx.session.selectedWorkflow.name}...`
        );
        await ctx.reply(
            "Your file has been received and is being processed. You will be notified when the upload is complete."
        );
    } catch (error) {
        console.error(`Error processing ${type}:`, error);
        await ctx.reply(
            "Sorry, there was an error processing your file. Please try again."
        );
    }
}

// Handle callback queries
bot.action("show_workflows", async (ctx) => {
    try {
        const message = "🔧 *Available Workflows*\n\nSelect a workflow to get started:";
        
        // Create buttons in a 2x2 grid
        const buttons = [];
        for (let i = 0; i < availableWorkflows.length; i += 2) {
            const row = [];
            // Add first button in the row
            row.push({
                text: availableWorkflows[i].name,
                callback_data: `execute_${availableWorkflows[i].id}`
            });
            // Add second button if it exists
            if (i + 1 < availableWorkflows.length) {
                row.push({
                    text: availableWorkflows[i + 1].name,
                    callback_data: `execute_${availableWorkflows[i + 1].id}`
                });
            }
            buttons.push(row);
        }
        
        // Add the back button at the bottom
        buttons.push([{ text: "🔙 Back to Start", callback_data: "show_about" }]);

        await ctx.editMessageText(message, {
            parse_mode: "MarkdownV2",
            link_preview_options: { is_disabled: true },
            reply_markup: {
                inline_keyboard: buttons
            }
        });
    } catch (error) {
        console.error("Error showing workflows:", error);
        await ctx.reply("Sorry, there was an error displaying the workflows\\. Please try /workflows instead\\.");
    }
});

// Add handlers for each workflow button
availableWorkflows.forEach(workflow => {
    // Handler for showing workflow details
    bot.action(`execute_${workflow.id}`, async (ctx) => {
        try {
            const name = escapeMarkdown(workflow.name);
            const description = escapeMarkdown(workflow.description);
            const message = `*${name}*\n\n${description}\n\n💡 Click Execute to start this workflow`;

            await ctx.reply(message, {
                parse_mode: "MarkdownV2",
                link_preview_options: { is_disabled: true },
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "▶️ Execute", callback_data: `run_${workflow.id}` }]
                    ]
                }
            });

            // Send a callback query answer to remove the loading state
            await ctx.answerCbQuery();
        } catch (error) {
            console.error(`Error showing workflow details ${workflow.id}:`, error);
            await ctx.reply(
                "Sorry, there was an error displaying the workflow details\\. Please try again\\.",
                { parse_mode: "MarkdownV2" }
            );
        }
    });

    // Handler for executing the workflow
    bot.action(`run_${workflow.id}`, async (ctx) => {
        try {
            if (workflow.type === WorkflowType.TOKEN_MONITOR) {
                const tokens = await tokenMonitorService.getSupportedTokens();
                
                if (!tokens || tokens.length === 0) {
                    await ctx.reply(
                        "❌ No tokens available for monitoring at the moment\\.",
                        { parse_mode: "MarkdownV2" }
                    );
                    return;
                }
                
                // Create buttons in a 2x2 grid
                const buttons = [];
                for (let i = 0; i < tokens.length; i += 2) {
                    const row = [];
                    // Add first button in the row
                    row.push({
                        text: tokens[i],
                        callback_data: `token_price_${tokens[i]}`
                    });
                    // Add second button if it exists
                    if (i + 1 < tokens.length) {
                        row.push({
                            text: tokens[i + 1],
                            callback_data: `token_price_${tokens[i + 1]}`
                        });
                    }
                    buttons.push(row);
                }

                const message = "🪙 *Select a token to monitor:*";
                
                await ctx.reply(message, {
                    parse_mode: "MarkdownV2",
                    reply_markup: {
                        inline_keyboard: buttons
                    }
                });
            } else if (workflow.type === WorkflowType.ARWEAVE_UPLOAD) {
                await initializeServices();
                // Store the user's chat ID for notifications
                if (ctx.chat?.id) {
                    arweaveService.setUserChatId(ctx.chat.id.toString());
                } else {
                    throw new Error("Chat ID not found");
                }
                await ctx.reply(
                    `You've selected the ${workflow.name} workflow\\. Please send your media file \\(image, document, etc\\.\\) to @aogen\\_bot\\.`,
                    { parse_mode: "MarkdownV2" }
                );
            } else if (workflow.type === WorkflowType.TWITTER_MONITOR) {
                await initializeServices();
                await ctx.reply(
                    "Please enter the Twitter username you want to monitor \\(without the @ symbol\\):",
                    { parse_mode: "MarkdownV2" }
                );
                ctx.session = { selectedWorkflow: workflow };
            } else if (workflow.type === WorkflowType.DISCORD_MONITOR) {
                await ctx.reply(
                    "🤖 *First, invite Flowweave to your server:*\n" +
                    "[Click here to invite the bot](https://dub\\.sh/flowweave)\n\n" +
                    "📋 *Setup Steps:*\n" +
                    "1\\. *Discord Admin:* Use `/monitor channel:#your\\-channel`\n" +
                    "2\\. *You:* Use `/subscribe channel:#your\\-channel telegram:@" + ctx.from?.username + "`\n" +
                    "3\\. *You:* Use `/register\\_discord` in this chat\n\n" +
                    "💡 *Important:* Complete steps in order\\. The bot needs to be invited and channel monitored before subscribing\\!",
                    { 
                        parse_mode: "MarkdownV2",
                        link_preview_options: { is_disabled: true }
                    }
                );
            } else if (workflow.type === WorkflowType.DISCORD_EVENT_CALENDAR_SYNC) {
                const telegramUsername = ctx.from?.username;
                const chatId = ctx.chat?.id?.toString();

                if (!telegramUsername) {
                    await ctx.reply(
                        "❌ You need to set a Telegram username first\\! Go to Settings → Username in Telegram\\.",
                        { parse_mode: "MarkdownV2" }
                    );
                    return;
                }

                if (!chatId) {
                    await ctx.reply("❌ Could not get your chat ID\\. Please try again\\.", 
                        { parse_mode: "MarkdownV2" }
                    );
                    return;
                }

                // Initialize Discord Event Calendar Service if not already done
                if (!discordEventCalendarService) {
                    discordEventCalendarService = new DiscordEventCalendarService(bot);
                }

                // Get the real OAuth URL
                const authUrl = await discordEventCalendarService.initializeCalendarSync(
                    chatId,
                    telegramUsername
                );

                const message = 
                    "🤖 *First, invite Flowweave to your server:*\n" +
                    "[Click here to invite the bot](https://dub\\.sh/flowweave)\n\n" +
                    "🗓️ *Discord Event Calendar Sync Setup*\n\n" +
                    "This workflow will automatically sync Discord events to your Google Calendar\\!\n\n" +
                    "📋 *Setup Steps:*\n" +
                    "1\\. *Discord Admin:* Use `/setup\\-event\\-monitoring`\n" +
                    "2\\. *You:* Use `/calendar\\-sync @" + telegramUsername + "`\n" +
                    "3\\. Click the authorization link below\n" +
                    "4\\. Grant calendar access permissions\n" +
                    "5\\. Done\\! Events will sync automatically\n\n" +
                    "🔗 *Connect Google Calendar:*\n" +
                    `[Click here to authorize](${authUrl})\n\n` +
                    "💡 *Important:* Complete steps 1\\-2 in Discord first\\!\n\n" +
                    "✨ *Features:*\n" +
                    "• Auto\\-sync Discord events\n" +
                    "• 30\\-min event reminders\n" +
                    "• Real\\-time notifications\n" +
                    "• Multi\\-server support";
                
                await ctx.reply(message, {
                    parse_mode: "MarkdownV2",
                    link_preview_options: { is_disabled: true }
                });

                // Analytics
                analytics.capture({
                    distinctId: ctx.from?.id?.toString() || "unknown",
                    event: "Calendar_sync_initiated",
                    properties: {
                        telegramUsername: telegramUsername,
                        chatId: chatId,
                    },
                });
            } else if (workflow.type === WorkflowType.TOKEN_MONITOR) {
                await initializeServices();
                await ctx.reply(
                    "Please select a token to monitor from the list."
                );
                ctx.session = { selectedWorkflow: workflow };
            }

            // Send a callback query answer to remove the loading state
            await ctx.answerCbQuery();
        } catch (error) {
            console.error(`Error executing workflow ${workflow.id}:`, error);
            await ctx.reply(
                "Sorry, there was an error starting the workflow\\. Please try using the command directly\\.",
                { parse_mode: "MarkdownV2" }
            );
        }
    });
});

// Command to list available workflows
bot.command("workflows", async (ctx: BotContext) => {
    try {
        const message = "🔧 *Available Workflows*\n\nSelect a workflow to get started:";
        
        // Create buttons in a 2x2 grid
        const buttons = [];
        for (let i = 0; i < availableWorkflows.length; i += 2) {
            const row = [];
            // Add first button in the row
            row.push({
                text: availableWorkflows[i].name,
                callback_data: `execute_${availableWorkflows[i].id}`
            });
            // Add second button if it exists
            if (i + 1 < availableWorkflows.length) {
                row.push({
                    text: availableWorkflows[i + 1].name,
                    callback_data: `execute_${availableWorkflows[i + 1].id}`
                });
            }
            buttons.push(row);
        }

        // Initialize session
        ctx.session = {};
        await ctx.reply(message, {
            parse_mode: "MarkdownV2",
            link_preview_options: { is_disabled: true },
            reply_markup: {
                inline_keyboard: buttons
            }
        });
    } catch (error) {
        console.error("Error listing workflows:", error);
        await ctx.reply("Sorry, there was an error listing the workflows\\. Please try again\\.");
    }
});

bot.action("show_about", async (ctx) => {
    try {
        const aboutMessage =
        "🎉 *Welcome to Flowweave Bot\\!* 🚀\n\n" +
        "🤖 *About Flowweave:*\n" +
        "Flowweave is your all\\-in\\-one automation bot that helps you manage workflows across different platforms seamlessly\\.\n\n" +
        "📞 *Our Socials:*\n" +
        "• [Website](https://flowweave\\.ar\\.io)\n" +
        "• [Discord Server](https://discord\\.gg/XT2D9k53Nk)\n" +
        "• [GitHub](https://github\\.com/fluid\\-labs)\n\n";

        await ctx.editMessageText(aboutMessage, {
            parse_mode: "MarkdownV2",
            link_preview_options: { is_disabled: true },
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📋 Workflow List", callback_data: "show_workflows" }]
                ]
            }
        });
    } catch (error) {
        console.error("Error showing help:", error);
        await ctx.reply("Sorry, there was an error displaying the help message\\. Please try /help instead\\.");
    }
});

// Add handlers for token monitor workflow
bot.action(`execute_token_monitor`, async (ctx) => {
    try {
        const tokens = await tokenMonitorService.getSupportedTokens();
        
        if (!tokens || tokens.length === 0) {
            await ctx.reply(
                "❌ No tokens available for monitoring at the moment\\. Please try again later\\.",
                { parse_mode: "MarkdownV2" }
            );
            return;
        }
        
        // Create buttons in a 2x2 grid
        const buttons = [];
        for (let i = 0; i < tokens.length; i += 2) {
            const row = [];
            // Add first button in the row
            row.push({
                text: tokens[i],
                callback_data: `token_price_${tokens[i]}`
            });
            // Add second button if it exists
            if (i + 1 < tokens.length) {
                row.push({
                    text: tokens[i + 1],
                    callback_data: `token_price_${tokens[i + 1]}`
                });
            }
            buttons.push(row);
        }

        const message = "🪙 *Select a token to monitor:*";
        
        await ctx.editMessageText(message, {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: buttons
            }
        });

        await ctx.answerCbQuery();
    } catch (error) {
        console.error("Error showing token list:", error);
        await ctx.reply(
            "Sorry, there was an error fetching the token list\\. Please try again\\.",
            { parse_mode: "MarkdownV2" }
        );
    }
});

// Handle token price selection
bot.action(/^token_price_(.+)$/, async (ctx) => {
    try {
        const token = ctx.match[1];
        const chatId = ctx.chat?.id.toString();
        
        if (!chatId) {
            throw new Error("Chat ID not found");
        }

        // Get current price
        const price = await tokenMonitorService.getTokenPrice(token);
        
        // Get user's active monitors to check if this token is already being monitored
        const activeMonitors = await tokenMonitorService.getUserMonitors(chatId);
        const isMonitored = activeMonitors.some(m => m.token === token);
        
        const escapedToken = token.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const escapedPrice = price.toFixed(4).replace(/\./g, '\\.');
        const message = `💰 The current price of *${escapedToken}* is $${escapedPrice}\\.\n\n${isMonitored ? "This token is already being monitored\\." : "What would you like to do?"}`;
        
        const buttons = [];
        if (!isMonitored) {
            buttons.push([{
                text: "📊 Start Monitoring",
                callback_data: `token_monitor_start_${token}`
            }]);
            buttons.push([{
                text: "🎯 Set Price Alert",
                callback_data: `token_set_alert_${token}`
            }]);
        }
        
        await ctx.reply(message, {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: buttons
            }
        });

        await ctx.answerCbQuery();
    } catch (error) {
        console.error("Error fetching token price:", error);
        await ctx.reply(
            "Sorry, there was an error fetching the token price\\. Please try again\\.",
            { parse_mode: "MarkdownV2" }
        );
    }
});

// Handle start monitoring selection
bot.action(/^token_monitor_start_(.+)$/, async (ctx) => {
    try {
        const token = ctx.match[1];
        const chatId = ctx.chat?.id.toString();
        
        if (!chatId) {
            throw new Error("Chat ID not found");
        }

        await tokenMonitorService.startPriceMonitor(token, chatId);
        
        const escapedToken = token.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        await ctx.reply(
            `✅ You will now receive price updates for *${escapedToken}*\\!`,
            { 
                parse_mode: "MarkdownV2",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📊 View Monitored Tokens", callback_data: "view_monitors" }]
                    ]
                }
            }
        );

        await ctx.answerCbQuery();
    } catch (error) {
        console.error("Error setting up monitoring:", error);
        await ctx.reply(
            "Sorry, there was an error setting up price monitoring\\. Please try again\\.",
            { parse_mode: "MarkdownV2" }
        );
    }
});

// Add handler for viewing monitored tokens
bot.action("view_monitors", async (ctx) => {
    console.log("[index] Received view_monitors action");
    try {
        const chatId = ctx.chat?.id.toString();
        console.log("[index] Chat ID:", chatId);
        
        if (!chatId) {
            throw new Error("Chat ID not found");
        }

        const activeMonitors = await tokenMonitorService.getUserMonitors(chatId);
        console.log("[index] Retrieved active monitors:", JSON.stringify(activeMonitors, null, 2));
        
        if (!activeMonitors || activeMonitors.length === 0) {
            console.log("[index] No active monitors found");
            await ctx.reply(
                "You don't have any active token monitors\\. Use /workflows and select Token Monitor to start monitoring tokens\\.",
                { parse_mode: "MarkdownV2" }
            );
            return;
        }

        // Create a formatted list of monitored tokens with their target prices
        const monitorsList = activeMonitors.map(monitor => {
            const escapedToken = monitor.token.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            const priceInfo = monitor.targetPrice 
                ? `\\(Alert at $${monitor.targetPrice.toFixed(4).replace(/\./g, '\\.')}\\)`
                : '\\(Price monitoring\\)';
            return `• *${escapedToken}* ${priceInfo}`;
        }).join('\n');

        const message = "🔍 *Your Active Token Monitors*\n\n" + monitorsList;
        
        // Create buttons for each monitored token
        const buttons = activeMonitors.map(monitor => [{
            text: `❌ Stop ${monitor.token}`,
            callback_data: `stop_monitor:${monitor.token}`
        }]);

        await ctx.reply(message, {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: buttons
            }
        });

        await ctx.answerCbQuery();

        // Analytics
        analytics.capture({
            distinctId: ctx.from?.id?.toString() || "unknown",
            event: "Token_monitors_viewed",
            properties: {
                monitorCount: activeMonitors.length,
            },
        });
    } catch (error) {
        console.error("[index] Error in view_monitors action:", error);
        await ctx.answerCbQuery("Failed to fetch monitored tokens. Please try again.");
    }
});

// Also add the View Monitored Tokens button after setting a price alert
bot.action(/^token_set_alert_(.+)$/, async (ctx) => {
    try {
        const token = ctx.match[1];
        const escapedToken = token.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        
        await ctx.reply(
            `Please enter your target price for *${escapedToken}* \\(e\\.g\\. 1\\.50 for $1\\.50\\):\\`,
            { 
                parse_mode: "MarkdownV2",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📊 View Monitored Tokens", callback_data: "view_monitors" }]
                    ]
                }
            }
        );
        
        // Store the token in session for the message handler
        ctx.session = { 
            selectedWorkflow: { 
                id: "token_alert", 
                name: "Token Price Alert",
                description: "Set price alerts for tokens",
                type: WorkflowType.TOKEN_MONITOR,
                params: { token } 
            } 
        };
        
        await ctx.answerCbQuery();
    } catch (error) {
        console.error("Error setting up price alert:", error);
        await ctx.reply(
            "Sorry, there was an error setting up the price alert\\. Please try again\\.",
            { parse_mode: "MarkdownV2" }
        );
    }
});

// Handle price alert value input
bot.on(message("text"), async (ctx) => {
    const selectedWorkflow = ctx.session?.selectedWorkflow;
    
    if (selectedWorkflow?.id === "token_alert" && selectedWorkflow.params?.token) {
        try {
            const targetPrice = parseFloat(ctx.message.text);
            
            if (isNaN(targetPrice) || targetPrice <= 0) {
                await ctx.reply(
                    "❌ Please enter a valid positive number for the target price\\.",
                    { parse_mode: "MarkdownV2" }
                );
                return;
            }

            const chatId = ctx.chat.id.toString();
            const token = selectedWorkflow.params.token;
            const escapedToken = token.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            const escapedPrice = targetPrice.toFixed(4).replace(/\./g, '\\.');

            await tokenMonitorService.setPriceAlert(token, targetPrice, chatId);
            
            await ctx.reply(
                `✅ Alert set\\! You will be notified when *${escapedToken}* reaches $${escapedPrice}\\!\n\nUse /token\\_monitors to manage your alerts\\!`,
                { parse_mode: "MarkdownV2" }
            );
        } catch (error) {
            console.error("Error setting price alert:", error);
            await ctx.reply(
                "Sorry, there was an error setting the price alert\\. Please try again\\.",
                { parse_mode: "MarkdownV2" }
            );
        } finally {
            // Clear the session
            ctx.session = {};
        }
    } else if (selectedWorkflow?.type === WorkflowType.TWITTER_MONITOR) {
        // ... existing Twitter monitor code ...
    } else if (selectedWorkflow) {
        // ... existing workflow code ...
    } else {
        // ... existing default code ...
    }
});

// Add command to list and manage token monitors
bot.command("token_monitors", async (ctx) => {
    console.log("[index] Received /token_monitors command");
    try {
        // Initialize session if needed
        ctx.session = ctx.session || {};
        console.log("[index] Session initialized:", ctx.session);

        const chatId = ctx.chat?.id.toString();
        console.log("[index] Chat ID:", chatId);
        
        if (!chatId) {
            throw new Error("Chat ID not found");
        }

        const activeMonitors = await tokenMonitorService.getUserMonitors(chatId);
        console.log("[index] Retrieved active monitors:", JSON.stringify(activeMonitors, null, 2));
        
        if (!activeMonitors || activeMonitors.length === 0) {
            console.log("[index] No active monitors found");
            await ctx.reply(
                "You don't have any active token monitors\\. Use /workflows and select Token Monitor to start monitoring tokens\\.",
                { parse_mode: "MarkdownV2" }
            );
            return;
        }

        // Create a formatted list of monitored tokens with their target prices
        const monitorsList = activeMonitors.map(monitor => {
            const escapedToken = monitor.token.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            const priceInfo = monitor.targetPrice 
                ? `\\(Alert at $${monitor.targetPrice.toFixed(4).replace(/\./g, '\\.')}\\)`
                : '\\(Price monitoring\\)';
            return `• *${escapedToken}* ${priceInfo}`;
        }).join('\n');

        const message = "🔍 *Your Active Token Monitors*\n\n" + monitorsList + "\n\nSelect a token to stop monitoring:";
        
        // Create buttons for each monitored token
        const buttons = activeMonitors.map(monitor => [{
            text: `❌ Stop ${monitor.token}`,
            callback_data: `stop_monitor:${monitor.token}`
        }]);

        await ctx.reply(message, {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: buttons
            }
        });

        // Analytics
        analytics.capture({
            distinctId: ctx.from?.id?.toString() || "unknown",
            event: "Token_monitors_listed",
            properties: {
                monitorCount: activeMonitors.length,
            },
        });
    } catch (error) {
        console.error("[index] Error in token_monitors command:", error);
        await ctx.reply(
            "Sorry, there was an error listing your token monitors\\. Please try again\\.",
            { parse_mode: "MarkdownV2" }
        );
    }
});

// Handle stop monitoring selection
bot.action(/^stop_monitor:(.+)$/, async (ctx) => {
    try {
        const token = ctx.match[1];
        const chatId = ctx.chat?.id.toString();
        
        if (!chatId) {
            throw new Error("Chat ID not found");
        }

        await tokenMonitorService.stopPriceMonitor(chatId, token);
        
        const escapedToken = token.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        await ctx.reply(
            `✅ Stopped monitoring *${escapedToken}*\\.\n\nUse /workflows to start monitoring another token\\!`,
            { parse_mode: "MarkdownV2" }
        );

        await ctx.answerCbQuery();

        // Analytics
        analytics.capture({
            distinctId: ctx.from?.id?.toString() || "unknown",
            event: "Token_monitor_stopped",
            properties: {
                token: token,
            },
        });
    } catch (error) {
        console.error("Error stopping token monitor:", error);
        await ctx.reply(
            "Sorry, there was an error stopping the token monitor\\. Please try again\\.",
            { parse_mode: "MarkdownV2" }
        );
    }
});

// Add command to test token price alerts
bot.command("test_price", async (ctx) => {
    console.log("[index] Received /test_price command");
    try {
        // Initialize session if needed
        ctx.session = ctx.session || {};
        console.log("[index] Session initialized:", ctx.session);

        const messageText = ctx.message?.text;
        console.log("[index] Message text:", messageText);

        if (!messageText) {
            console.log("[index] No message text found");
            await ctx.reply(
                "Invalid command format\\. Please try again\\.",
                { parse_mode: "MarkdownV2" }
            );
            return;
        }

        const args = messageText.split(" ");
        console.log("[index] Command args:", args);

        if (args.length !== 3) {
            console.log("[index] Invalid number of arguments");
            await ctx.reply(
                "Usage: /test\\_price <token> <price>\\. Example: /test\\_price BTC 50000",
                { parse_mode: "MarkdownV2" }
            );
            return;
        }

        const token = args[1].toUpperCase();
        const price = parseFloat(args[2]);
        console.log(`[index] Setting test price for ${token}: ${price}`);

        if (isNaN(price)) {
            console.log("[index] Invalid price format");
            await ctx.reply(
                "Invalid price format\\. Please provide a valid number\\.",
                { parse_mode: "MarkdownV2" }
            );
            return;
        }

        await tokenMonitorService.setTestPrice(token, price);
        console.log("[index] Test price set successfully");

        await ctx.reply(
            `✅ Test price for *${token}* set to $${price.toFixed(4)}\\. Any active monitors or alerts will be triggered on the next check\\.`,
            { parse_mode: "MarkdownV2" }
        );

    } catch (error) {
        console.error("[index] Error in test_price command:", error);
        await ctx.reply(
            "Sorry, there was an error setting the test price\\. Please try again\\.",
            { parse_mode: "MarkdownV2" }
        );
    }
});

// Start the OAuth server for Google Calendar integration
startOAuthServer();

// Register bot commands
const commands = [
    { command: 'start', description: 'Start the bot' },
    { command: 'workflows', description: 'List available workflows' },
    { command: 'about', description: 'About Flowweave' },
    { command: 'register_discord', description: 'Register for Discord notifications' },
    { command: 'token_monitors', description: 'Manage your token monitors' },
    { command: 'test_price', description: 'Test token price alerts by setting a test price' }
];

// Start the bot
bot.launch()
    .then(async () => {
        console.log("🤖 Telegram Bot is running...");
        
        // Set bot commands after launch
        await bot.telegram.setMyCommands(commands);

        // Initialize services
        await initializeServices();
    })
    .catch((err) => {
        console.error("Error starting bot:", err);
    });

// Enable graceful stop
process.once("SIGINT", () => {
    bot.stop("SIGINT");
    analytics.shutdown();
    tokenMonitorService.cleanup();
});
process.once("SIGTERM", () => {
    bot.stop("SIGTERM");
    analytics.shutdown();
    tokenMonitorService.cleanup();
});
