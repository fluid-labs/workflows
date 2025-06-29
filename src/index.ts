import { Telegraf, Context, session } from "telegraf";
import { message } from "telegraf/filters";
import { config } from "dotenv";
import { Workflow, WorkflowType } from "./types/workflow";
import { ArweaveService } from "./services/arweave.service";
import { TwitterService } from "./services/twitter.service";
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
            "Upload media files (images, documents, etc.) to Arweave and receive a notification",
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
];

// Command to start the bot
bot.command("start", async (ctx: BotContext) => {
    const welcomeMessage =
        "Welcome to FlowWeave Bot! 🚀\n\n" +
        "I can help you execute various workflows. Here are the available commands:\n\n" +
        "/workflows - View available workflows\n" +
        "/register_discord - Link your Discord account for notifications\n" +
        "/help - Show this help message";

    // Initialize session
    ctx.session = {};

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

    await ctx.reply(welcomeMessage);
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
    const workflowList = availableWorkflows
        .map(
            (workflow) =>
                `🔹 ${workflow.name}\n${workflow.description}\nUse /execute_${workflow.id} to run this workflow`
        )
        .join("\n\n");

    // Initialize session
    ctx.session = {};
    await ctx.reply("Available Workflows:\n\n" + workflowList);
});

// Help command
bot.command("help", async (ctx: BotContext) => {
    try {
        const helpMessage =
            "FlowWeave Bot Help 📚\n\n" +
            "Available Commands:\n" +
            "/start - Start the bot\n" +
            "/workflows - View available workflows\n" +
            "/help - Show this help message\n\n" +
            "Workflow-specific commands:\n" +
            "/execute_arweave - Upload files to Arweave\n" +
            "/execute_twitter - Monitor a Twitter account\n" +
            "/stop_twitter - Stop monitoring a Twitter account\n\n" +
            "To use a workflow:\n" +
            "1. Use /workflows to see available workflows\n" +
            "2. Select a workflow using its command\n" +
            "3. Follow the instructions for the specific workflow";

        await ctx.reply(helpMessage);
    } catch (error) {
        console.error("Error sending help message:", error);
        await ctx.reply(
            "Sorry, there was an error displaying the help message. Please try again."
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

// Start the bot
bot.launch()
    .then(() => {
        console.log("Bot is running...");
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
