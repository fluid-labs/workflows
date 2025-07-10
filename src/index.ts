import { Telegraf, Context, session } from "telegraf";
import { message } from "telegraf/filters";
import { config } from "dotenv";
import { Workflow, WorkflowType } from "./types/workflow";
import { ArweaveService } from "./services/arweave.service";
import { TwitterService } from "./services/twitter.service";
import { DiscordEventCalendarService } from "./services/discord-event-calendar.service";
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

// Define custom context type
interface BotContext extends Context {
    session: {
        selectedWorkflow?: Workflow;
        twitterUsername?: string;
    };
}

const bot = new Telegraf<BotContext>(process.env.TELEGRAM_BOT_TOKEN!);

// Add session middleware
bot.use(session());

const arweaveService = new ArweaveService(bot);
const twitterService = new TwitterService(bot);
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
            "🎉 Welcome to FlowWeave Bot\\! 🚀\n\n" +
            "🤖 About FlowWeave:\n" +
            "FlowWeave is your all\\-in\\-one automation bot that helps you manage workflows across different platforms seamlessly\\.\n\n" +
            "📞 Our Socials:\n" +
            "• Website: [flowweave\\.xyz](https://flowweave\\.xyz)\n" +
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
        
        // Create a button for each workflow
        const buttons = availableWorkflows.map(workflow => [{
            text: `${workflow.name}`,
            callback_data: `execute_${workflow.id}`
        }]);

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
        "🎉 *Welcome to FlowWeave Bot\\!* 🚀\n\n" +
        "🤖 *About FlowWeave:*\n" +
        "FlowWeave is your all\\-in\\-one automation bot that helps you manage workflows across different platforms seamlessly\\.\n\n" +
        "📞 *Our Socials:*\n" +
        "• [Website](https://flowweave\\.xyz)\n" +
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

                        const message = [
                    `🗓️ *Discord Event Calendar Sync Setup*`,
                    ``,
                    `This workflow will automatically sync Discord events to your Google Calendar\\!`,
                    ``,
                    `📋 *Correct Setup Order:*`,
                    `1\\. *Discord Admin:* Use \`/setup\\-event\\-monitoring\` in your server ✅`,
                    `2\\. *You:* Use \`/calendar\\-sync telegram\\-username:${telegramUsername}\` in Discord ✅`,
                    `3\\. *You:* Click the Google Calendar authorization link below`,
                    `4\\. Grant calendar permissions`,
                    `5\\. Events will automatically sync to your calendar\\!`,
                    ``,
                    `🔗 *Google Calendar Authorization:*`,
                    `[Click here to authorize Google Calendar](${authUrl})`,
                    ``,
                    `💡 *Important:* Make sure you've completed steps 1\\-2 in Discord first, otherwise the calendar connection won't link to any Discord servers\\!`,
                    ``,
                    `✨ *Features:*`,
                    `• Automatic event sync from Discord`,
                    `• Customizable reminders \\(30 min before events\\)`,
                    `• Real\\-time notifications via Telegram`,
                    `• Support for multiple Discord servers`
                ].join('\\n');
                
                await ctx.reply(message,
            {
                parse_mode: "Markdown",
                link_preview_options: { is_disabled: true },
            }
        );

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
bot.on(message("photo"), async (ctx: BotContext) => {
    await handleMediaMessage(ctx, "photo");
});

bot.on(message("document"), async (ctx: BotContext) => {
    await handleMediaMessage(ctx, "document");
});

bot.on(message("video"), async (ctx: BotContext) => {
    await handleMediaMessage(ctx, "video");
});

bot.on(message("audio"), async (ctx: BotContext) => {
    await handleMediaMessage(ctx, "audio");
});

// Helper function to handle media messages
async function handleMediaMessage(ctx: BotContext, type: string) {
    const selectedWorkflow = ctx.session?.selectedWorkflow;

    if (!selectedWorkflow) {
        await ctx.reply("Please select a workflow first using /workflows");
        return;
    }

    try {
        await ctx.reply(
            `Processing your ${type} with ${selectedWorkflow.name}...`
        );
        // Since we're not handling media in this bot anymore, we don't need to set any context
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
            if (workflow.type === WorkflowType.ARWEAVE_UPLOAD) {
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
                    "Please use /register\\_discord to setup Discord notifications first\\.",
                    { parse_mode: "MarkdownV2" }
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

                const message = [
                    `🗓️ *Discord Event Calendar Sync Setup*`,
                    ``,
                    `This workflow will automatically sync Discord events to your Google Calendar\\!`,
                    ``,
                    `📋 *Correct Setup Order:*`,
                    `1\\. *Discord Admin:* Use \`/setup\\-event\\-monitoring\` in your server ✅`,
                    `2\\. *You:* Use \`/calendar\\-sync telegram\\-username:${telegramUsername}\` in Discord ✅`,
                    `3\\. *You:* Click the Google Calendar authorization link below`,
                    `4\\. Grant calendar permissions`,
                    `5\\. Events will automatically sync to your calendar\\!`,
                    ``,
                    `🔗 *Google Calendar Authorization:*`,
                    `[Click here to authorize Google Calendar](${authUrl})`,
                    ``,
                    `💡 *Important:* Make sure you've completed steps 1\\-2 in Discord first, otherwise the calendar connection won't link to any Discord servers\\!`,
                    ``,
                    `✨ *Features:*`,
                    `• Automatic event sync from Discord`,
                    `• Customizable reminders \\(30 min before events\\)`,
                    `• Real\\-time notifications via Telegram`,
                    `• Support for multiple Discord servers`
                ].join('\\n');
                
                await ctx.reply(message,
                    {
                        parse_mode: "MarkdownV2",
                        link_preview_options: { is_disabled: true }
                    }
                );

                // Analytics
                analytics.capture({
                    distinctId: ctx.from?.id?.toString() || "unknown",
                    event: "Calendar_sync_initiated",
                    properties: {
                        telegramUsername: telegramUsername,
                        chatId: chatId,
                    },
                });
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
        "🎉 *Welcome to FlowWeave Bot\\!* 🚀\n\n" +
        "🤖 *About FlowWeave:*\n" +
        "FlowWeave is your all\\-in\\-one automation bot that helps you manage workflows across different platforms seamlessly\\.\n\n" +
        "📞 *Our Socials:*\n" +
        "• [Website](https://flowweave\\.xyz)\n" +
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

// Start the OAuth server for Google Calendar integration
startOAuthServer();

// Start the bot
bot.launch()
    .then(() => {
        console.log("🤖 Telegram Bot is running...");
    })
    .catch((err) => {
        console.error("Error starting bot:", err);
    });

// Enable graceful stop
process.once("SIGINT", () => {
    bot.stop("SIGINT");
    analytics.shutdown();
});
process.once("SIGTERM", () => {
    bot.stop("SIGTERM");
    analytics.shutdown();
});
