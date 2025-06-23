# FlowWeave Telegram Bot

A Telegram bot interface for executing FlowWeave workflows, specializing in media file processing and Arweave uploads. This bot allows users to upload media files to Arweave through a simple chat interface.

## Features

- Upload media files (images, documents, videos, audio) to Arweave
- Automatic file processing and status notifications
- Simple and intuitive command interface
- Real-time upload status tracking
- Secure and persistent file storage on Arweave

## Prerequisites

- Node.js (v14 or higher)
- pnpm package manager
- A Telegram Bot Token (obtain from [@BotFather](https://t.me/botfather))
- Access to FlowWeave API endpoints

## Setup

1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file in the root directory and add your Telegram bot token:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

3. Build the TypeScript code:
   ```bash
   pnpm build
   ```

4. Start the bot:
   ```bash
   pnpm start
   ```

   For development with hot-reload:
   ```bash
   pnpm dev
   ```

## Available Commands

- `/start` - Initialize the bot and see available commands
- `/workflows` - List all available workflows
- `/help` - Show help information
- `/execute_arweave` - Start the Arweave upload workflow

## Using the Bot

1. Start by sending `/execute_arweave` to select the Arweave upload workflow
2. Send any media file (supported types: images, documents, videos, audio)
3. The bot will:
   - Process your file
   - Upload to Arweave
   - Send you the Arweave URL once complete

Note: The bot only processes media files. Text messages (except commands) will be ignored.

## Project Structure

The project uses TypeScript for type safety and better development experience. Key files:

- `src/index.ts` - Main bot logic and command handlers
- `src/types/workflow.ts` - Type definitions for workflows
- `src/types/api.ts` - Type definitions for API responses
- `src/services/arweave.service.ts` - Arweave upload service implementation

## API Integration

The bot integrates with the following FlowWeave API endpoints:

- `/api/telegram/initialize` - Bot initialization
- `/api/telegram/start` - Start bot service
- `/api/telegram/files/recent` - Check for new files
- `/api/telegram/ardrive/files/{id}/cost` - Get upload cost
- `/api/telegram/ardrive/files/{id}/upload` - Upload to Arweave
- `/api/proxy/telegram/send` - Send notifications

## Development

To add new workflows:
1. Add new workflow types in `src/types/workflow.ts`
2. Update the `availableWorkflows` array in `src/index.ts`
3. Implement the corresponding service in `src/services/`

## Error Handling

The bot includes comprehensive error handling for:
- File processing errors
- Insufficient funds for uploads
- API communication issues
- Invalid file types

## License

ISC 