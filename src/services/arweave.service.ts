import { ArweaveUploadResponse, FileCostResponse, RecentFilesResponse, SendMessageRequest, TelegramFile } from '../types/api';
import { PostHog } from 'posthog-node';
import { Telegraf, Context } from 'telegraf';

const API_BASE_URL = 'https://api-flowweave.vesala.xyz/api';

// Define the context type to match index.ts
interface BotContext extends Context {
  session: {
    selectedWorkflow?: any;
  };
}

export class ArweaveService {
  private lastCheckedTimestamp: string | null = null;
  private analytics: PostHog;
  private isPolling: boolean = false;
  private bot: Telegraf<BotContext>;
  private userChatId: string | null = null;

  constructor(bot: Telegraf<BotContext>) {
    this.analytics = new PostHog(process.env.POSTHOG_API_KEY!, {
      host: 'https://us.i.posthog.com'
    });
    this.bot = bot;
  }

  // Method to set the user's chat ID when they initiate a workflow
  setUserChatId(chatId: string) {
    this.userChatId = chatId;
  }

  async initialize(): Promise<void> {
    try {
      // Initialize the telegram bot
      await fetch(`${API_BASE_URL}/telegram/initialize`, {
        method: 'POST',
      });

      // Start the bot
      await fetch(`${API_BASE_URL}/telegram/start`, {
        method: 'POST',
      });

      this.analytics.capture({
        distinctId: this.userChatId || 'unknown',
        event: 'Workflow Triggered',
        properties: {
          workflow_type: 'telegram_init',
          action: 'initialize',
          status: 'success'
        }
      });
    } catch (error) {
      this.analytics.capture({
        distinctId: this.userChatId || 'unknown',
        event: 'Workflow Triggered',
        properties: {
          workflow_type: 'telegram_init',
          action: 'initialize',
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      console.error('Failed to initialize bot:', error);
      throw error;
    }
  }

  async checkForNewFiles(): Promise<TelegramFile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/telegram/files/recent`);
      const data = await response.json() as RecentFilesResponse;

      if (!data.success) {
        throw new Error('Failed to fetch recent files');
      }

      // Update the last checked timestamp
      const newFiles = this.lastCheckedTimestamp
        ? data.files.filter(file => 
            new Date(file.createdAt) > new Date(this.lastCheckedTimestamp!)
            && file.arweaveUploadStatus === 'pending'
          )
        : data.files.filter(file => file.arweaveUploadStatus === 'pending');

      this.lastCheckedTimestamp = data.timestamp;

      return newFiles;
    } catch (error) {
      console.error('Failed to check for new files:', error);
      throw error;
    }
  }

  async getUploadCost(fileId: string): Promise<FileCostResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/telegram/ardrive/files/${fileId}/cost`
      );
      const data = await response.json() as FileCostResponse;

      if (!data.success) {
        throw new Error('Failed to get upload cost');
      }

      this.analytics.capture({
        distinctId: this.userChatId || 'unknown',
        event: 'Workflow Triggered',
        properties: {
          workflow_type: 'ardrive_cost',
          action: 'getCost',
          status: 'success',
          fileId,
          cost: data.cost_estimate.ar,
          sufficientFunds: data.cost_estimate.sufficient
        }
      });

      return data;
    } catch (error) {
      this.analytics.capture({
        distinctId: this.userChatId || 'unknown',
        event: 'Workflow Triggered',
        properties: {
          workflow_type: 'ardrive_cost',
          action: 'getCost',
          status: 'failed',
          fileId,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      console.error('Failed to get upload cost:', error);
      throw error;
    }
  }

  async uploadToArweave(fileId: string): Promise<ArweaveUploadResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/telegram/ardrive/files/${fileId}/upload`,
        {
          method: 'POST',
        }
      );
      const data = await response.json() as ArweaveUploadResponse;

      if (!data.success) {
        throw new Error('Failed to upload to Arweave');
      }

      this.analytics.capture({
        distinctId: this.userChatId || 'unknown',
        event: 'Workflow Triggered',
        properties: {
          workflow_type: 'ardrive_upload',
          action: 'upload',
          status: 'success',
          fileId,
          arweaveUrl: data.arweave_url
        }
      });

      return data;
    } catch (error) {
      this.analytics.capture({
        distinctId: this.userChatId || 'unknown',
        event: 'Workflow Triggered',
        properties: {
          workflow_type: 'ardrive_upload',
          action: 'upload',
          status: 'failed',
          fileId,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      console.error('Failed to upload to Arweave:', error);
      throw error;
    }
  }

  async sendNotification(arweaveUrl: string): Promise<void> {
    try {
      const message = `File uploaded to Arweave: ${arweaveUrl}`;
      
      // Send message using the bot instance to the stored user chat ID
      if (this.userChatId) {
        await this.bot.telegram.sendMessage(this.userChatId, message);
      }

      this.analytics.capture({
        distinctId: this.userChatId || 'unknown',
        event: 'Workflow Triggered',
        properties: {
          workflow_type: 'telegram_notify',
          action: 'notify',
          status: 'success',
          arweaveUrl
        }
      });
    } catch (error) {
      this.analytics.capture({
        distinctId: this.userChatId || 'unknown',
        event: 'Workflow Triggered',
        properties: {
          workflow_type: 'telegram_notify',
          action: 'notify',
          status: 'failed',
          arweaveUrl,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  async processNewFile(file: TelegramFile): Promise<void> {
    try {
      // 1. Get upload cost
      const costResponse = await this.getUploadCost(file.id);
      
      // Check if we have sufficient funds
      if (!costResponse.cost_estimate.sufficient) {
        if (this.userChatId) {
          await this.bot.telegram.sendMessage(this.userChatId, 'Insufficient funds for upload');
        }
        throw new Error('Insufficient funds for upload');
      }

      // 2. Upload to Arweave
      const uploadResponse = await this.uploadToArweave(file.id);

      // 3. Send notification
      await this.sendNotification(uploadResponse.arweave_url);

    } catch (error) {
      console.error(`Failed to process file ${file.id}:`, error);
      throw error;
    }
  }

  async startPolling(intervalMs: number = 5000): Promise<void> {
    if (this.isPolling) {
      return; // Already polling
    }

    try {
      // Initialize the bot first (not part of polling)
      await this.initialize();
      
      this.isPolling = true;

      // Start polling loop (only for checkForNewFiles)
      setInterval(async () => {
        try {
          const newFiles = await this.checkForNewFiles();
          
          // Process each new file
          for (const file of newFiles) {
            await this.processNewFile(file);
          }
        } catch (error) {
          console.error('Error in polling loop:', error);
          // Continue polling even if there's an error
        }
      }, intervalMs);
    } catch (error) {
      this.isPolling = false;
      console.error('Failed to start polling:', error);
      throw error;
    } finally {
      // Ensure all events are sent before the process exits
      await this.analytics.shutdown();
    }
  }
} 