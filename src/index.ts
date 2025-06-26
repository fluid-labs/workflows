import { Telegraf, Context, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from 'dotenv';
import { Workflow, WorkflowType } from './types/workflow';
import { ArweaveService } from './services/arweave.service';
import { PostHog } from 'posthog-node';

// Load environment variables
config();

// Initialize PostHog
const analytics = new PostHog(process.env.POSTHOG_API_KEY!, {
  host: 'https://us.i.posthog.com'
});

// Define custom context type
interface BotContext extends Context {
  session: {
    selectedWorkflow?: Workflow;
  };
}

const bot = new Telegraf<BotContext>(process.env.TELEGRAM_BOT_TOKEN!);

// Add session middleware
bot.use(session());

const arweaveService = new ArweaveService(bot);

// Initialize the Arweave service when the bot starts
let arweaveServiceInitialized = false;

async function initializeArweaveService() {
  if (!arweaveServiceInitialized) {
    try {
      await arweaveService.startPolling()
        .catch(error => {
          console.error('Error in Arweave service polling:', error);
        });
      arweaveServiceInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Arweave service:', error);
      throw error;
    }
  }
}

// Sample workflows - replace with your actual workflow data
const availableWorkflows: Workflow[] = [
  {
    id: 'arweave',
    name: 'Arweave Upload',
    description: 'Upload media files (images, documents, etc.) to Arweave and receive a notification',
    type: WorkflowType.ARWEAVE_UPLOAD,
  },
  // Add more workflows here
];

// Command to start the bot
bot.command('start', async (ctx: BotContext) => {
  const welcomeMessage = 'Welcome to FlowWeave Bot! 🚀\n\n' +
    'I can help you execute various workflows. Here are the available commands:\n\n' +
    '/workflows - View available workflows\n' +
    '/help - Show this help message';
  
  // Initialize session
  ctx.session = {};

  // Capture bot start event
  analytics.capture({
    distinctId: ctx.from?.id?.toString() || 'unknown',
    event: 'Bot_started',
    properties: {
      action: 'start_bot',
      username: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name
    }
  });

  await ctx.reply(welcomeMessage);
});

// Command to list available workflows
bot.command('workflows', async (ctx: BotContext) => {
  const workflowList = availableWorkflows
    .map(workflow => `🔹 ${workflow.name}\n${workflow.description}\nUse /execute_${workflow.id} to run this workflow`)
    .join('\n\n');

  // Initialize session
  ctx.session = {};
  await ctx.reply('Available Workflows:\n\n' + workflowList);
});

// Help command
bot.command('help', async (ctx: BotContext) => {
  try {
    const helpMessage = 'FlowWeave Bot Help 📚\n\n' +
      'Available Commands:\n' +
      '/start - Start the bot\n' +
      '/workflows - View available workflows\n' +
      '/help - Show this help message\n\n' +
      'To use a workflow:\n' +
      '1. Use /workflows to see available workflows\n' +
      '2. Select a workflow using its command (e.g., /execute_arweave)\n' +
      '3. Follow the instructions in the workflow';
    
    await ctx.reply(helpMessage);
  } catch (error) {
    console.error('Error sending help message:', error);
    await ctx.reply('Sorry, there was an error displaying the help message. Please try again.');
  }
});

// Handle workflow execution commands
availableWorkflows.forEach(workflow => {
  bot.command(`execute_${workflow.id}`, async (ctx: BotContext) => {
    try {
      if (workflow.type === WorkflowType.ARWEAVE_UPLOAD) {
        await initializeArweaveService();
        // Store the user's chat ID for notifications
        if (ctx.chat?.id) {
          arweaveService.setUserChatId(ctx.chat.id.toString());
        } else {
          throw new Error('Chat ID not found');
        }
      }
      await ctx.reply(`You've selected the ${workflow.name} workflow. Please send your media file (image, document, etc.) to @aogen_bot.`);
      ctx.session = { selectedWorkflow: workflow };
    } catch (error) {
      console.error('Error initializing workflow:', error);
      await ctx.reply('Sorry, there was an error initializing the workflow. Please try again.');
    }
  });
});

// Handle text messages
bot.on('message', async (ctx) => {
  // Only handle text messages that aren't commands
  if ('text' in ctx.message && !ctx.message.text.startsWith('/')) {
    const selectedWorkflow = ctx.session?.selectedWorkflow;
    
    if (selectedWorkflow) {
      // If a workflow is selected, show the media-only message
      await ctx.reply('This workflow only supports media files (images, documents, etc.). Please send a media file to @aogen_bot or use /workflows to select a different workflow.');
    } else {
      // If no workflow is selected, guide the user to select one
      await ctx.reply('Please use /workflows to see available workflows and select one to get started.');
    }
  }
});

// Handle photo messages
bot.on(message('photo'), async (ctx: BotContext) => {
  await handleMediaMessage(ctx, 'photo');
});

// Handle document messages
bot.on(message('document'), async (ctx: BotContext) => {
  await handleMediaMessage(ctx, 'document');
});

// Handle video messages
bot.on(message('video'), async (ctx: BotContext) => {
  await handleMediaMessage(ctx, 'video');
});

// Handle audio messages
bot.on(message('audio'), async (ctx: BotContext) => {
  await handleMediaMessage(ctx, 'audio');
});

// Helper function to handle media messages
async function handleMediaMessage(ctx: BotContext, type: string) {
  const selectedWorkflow = ctx.session?.selectedWorkflow;
  
  if (!selectedWorkflow) {
    await ctx.reply('Please select a workflow first using /workflows');
    return;
  }

  try {
    await ctx.reply(`Processing your ${type} with ${selectedWorkflow.name}...`);
    // Since we're not handling media in this bot anymore, we don't need to set any context
    await ctx.reply('Your file has been received and is being processed. You will be notified when the upload is complete.');
  } catch (error) {
    console.error(`Error processing ${type}:`, error);
    await ctx.reply('Sorry, there was an error processing your file. Please try again.');
  }
}

// Start the bot
bot.launch()
  .then(() => {
    console.log('Bot is running...');
  })
  .catch((err) => {
    console.error('Error starting bot:', err);
  });

// Enable graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  analytics.shutdown();
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  analytics.shutdown();
});