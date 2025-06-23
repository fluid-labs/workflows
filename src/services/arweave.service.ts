import { ArweaveUploadResponse, FileCostResponse, RecentFilesResponse, SendMessageRequest, TelegramFile } from '../types/api';

const API_BASE_URL = 'https://api-flowweave.vesala.xyz/api';

export class ArweaveService {
  private lastCheckedTimestamp: string | null = null;
  private chatId: string = "-4770042285"; // You might want to make this configurable

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
    } catch (error) {
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

      return data;
    } catch (error) {
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

      return data;
    } catch (error) {
      console.error('Failed to upload to Arweave:', error);
      throw error;
    }
  }

  async sendNotification(arweaveUrl: string): Promise<void> {
    try {
      const message: SendMessageRequest = {
        chatId: this.chatId,
        message: `File uploaded to Arweave: ${arweaveUrl}`,
      };

      const response = await fetch(`${API_BASE_URL}/proxy/telegram/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const data = await response.json() as { success: boolean };
      if (!data.success) {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
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
    try {
      // Initialize the bot first
      await this.initialize();

      // Start polling loop
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
      console.error('Failed to start polling:', error);
      throw error;
    }
  }
} 