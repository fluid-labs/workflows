import express from "express";
import { DiscordEventCalendarService } from "./services/discord-event-calendar.service";
import { Telegraf } from "telegraf";
import { config } from "dotenv";

config();

const app = express();
const port = 8080;

// Initialize Telegram bot for the OAuth callback service
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const discordEventCalendarService = new DiscordEventCalendarService(bot);

// Handle Google OAuth callback
app.get("/auth/google/callback", async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code || !state) {
            res.status(400).send(`
                <html>
                    <body>
                        <h1>❌ Authorization Failed</h1>
                        <p>Missing authorization code or state parameter.</p>
                        <p>Please try the setup process again in Telegram.</p>
                    </body>
                </html>
            `);
            return;
        }

        // Handle the OAuth callback
        const success = await discordEventCalendarService.handleOAuthCallback(
            code as string,
            state as string
        );

        if (success) {
            res.send(`
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            .success { color: #28a745; }
                            .container { max-width: 500px; margin: 0 auto; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1 class="success">✅ Google Calendar Connected!</h1>
                            <p>Your Discord events will now automatically sync to your Google Calendar.</p>
                            <p><strong>You can close this window and return to Telegram.</strong></p>
                            <hr>
                            <p><small>FlowWeave Discord Event Calendar Sync</small></p>
                        </div>
                    </body>
                </html>
            `);
        } else {
            res.status(500).send(`
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            .error { color: #dc3545; }
                            .container { max-width: 500px; margin: 0 auto; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1 class="error">❌ Setup Failed</h1>
                            <p>There was an error connecting your Google Calendar.</p>
                            <p>Please try the setup process again in Telegram with <code>/execute_calendar_sync</code></p>
                            <hr>
                            <p><small>FlowWeave Discord Event Calendar Sync</small></p>
                        </div>
                    </body>
                </html>
            `);
        }
    } catch (error) {
        console.error("OAuth callback error:", error);
        res.status(500).send(`
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .error { color: #dc3545; }
                        .container { max-width: 500px; margin: 0 auto; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="error">❌ Server Error</h1>
                        <p>An unexpected error occurred during the setup process.</p>
                        <p>Please try again later or contact support.</p>
                        <hr>
                        <p><small>FlowWeave Discord Event Calendar Sync</small></p>
                    </div>
                </body>
            </html>
        `);
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "FlowWeave OAuth Server" });
});

// Start the OAuth server
export function startOAuthServer() {
    app.listen(port, "0.0.0.0", () => {
        console.log(`🔗 OAuth server running at:`);
        console.log(`   • http://localhost:${port}`);
        console.log(`   • http://127.0.0.1:${port}`);
        console.log(
            `📋 Google Calendar callback URL: http://127.0.0.1:${port}/auth/google/callback`
        );
    });
}

// Start server if this file is run directly
if (require.main === module) {
    startOAuthServer();
}
