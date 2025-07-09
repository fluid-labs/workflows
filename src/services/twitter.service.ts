import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { PostHog } from "posthog-node";
import { Telegraf, Context } from "telegraf";

const API_BASE_URL = "https://api-flowweave.vesala.xyz/api";

interface BotContext extends Context {
    session: {
        selectedWorkflow?: any;
    };
}

interface TwitterResponse {
    success: boolean;
    data: {
        user: {
            id: string;
            rest_id: string;
            description: string;
            followers_count: number;
            friends_count: number;
            verified: boolean;
        };
        tweets: {
            id: string;
            text: string;
            created_at: string;
            author: {
                name: string;
                screen_name: string;
                profile_image_url: string;
            };
            public_metrics: {
                retweet_count: number;
                like_count: number;
                reply_count: number;
                quote_count: number;
            };
            media?: {
                type: string;
                url: string;
                preview_image_url: string;
            }[];
        }[];
        timestamp: string;
    };
}

export class TwitterService {
    private prisma: PrismaClient;
    private analytics: PostHog;
    private isPolling: boolean = false;
    private bot: Telegraf<BotContext>;
    private monitorTimeouts: Map<string, NodeJS.Timeout> = new Map();

    constructor(bot: Telegraf<BotContext>) {
        this.prisma = new PrismaClient();
        this.analytics = new PostHog(process.env.POSTHOG_API_KEY!, {
            host: "https://us.i.posthog.com",
        });
        this.bot = bot;
    }

    async addMonitor(username: string, chatId: string): Promise<void> {
        try {
            // Check if the user already has any active monitors
            const existingUserMonitor = await this.prisma.twitterMonitor.findFirst({
                where: { chatId },
            });

            if (existingUserMonitor) {
                await this.bot.telegram.sendMessage(
                    chatId,
                    `⚠️ During our testing phase, you can only monitor one Twitter account at a time.\n\n` +
                    `You are currently monitoring @${existingUserMonitor.username}.\n\n` +
                    `To monitor @${username} instead, first stop monitoring @${existingUserMonitor.username} using /stop_twitter.\n\n` +
                    `🔜 Our upcoming paid plan will allow you to monitor multiple accounts simultaneously!`
                );
                return;
            }

            // First check if the Twitter account exists and get initial tweets
            const response = await fetch(`${API_BASE_URL}/twitter/monitor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });

            const data = (await response.json()) as TwitterResponse;

            if (!data.success) {
                throw new Error("Failed to fetch Twitter data");
            }

            // Create new monitor
            const monitor = await this.prisma.twitterMonitor.create({
                data: {
                    username,
                    chatId,
                },
            });

            // Store initial tweets
            const tweetData = data.data.tweets.map((tweet) => ({
                id: tweet.id,
                monitorId: monitor.id,
                text: tweet.text,
                createdAt: new Date(tweet.created_at),
                metrics: tweet.public_metrics as Prisma.JsonObject,
                mediaUrls: tweet.media?.map((m) => m.url) || [],
            }));

            // Use createMany for better performance
            await this.prisma.tweetRecord.createMany({
                data: tweetData,
            });

            await this.bot.telegram.sendMessage(
                chatId,
                `✅ Started monitoring Twitter account @${username}!\n\n` +
                `🕒 Note: During our testing phase:\n` +
                `• Monitoring will automatically stop after 2.5 minutes\n` +
                `• You can only monitor one account at a time\n\n` +
                `🔜 Coming soon in our paid plan:\n` +
                `• Extended monitoring duration\n` +
                `• Monitor multiple accounts simultaneously\n` +
                `• Advanced analytics and features\n\n` +
                `You'll receive notifications for new tweets here!`
            );

            // Set a timeout to stop this specific monitor after 2.5 minutes
            const timeoutId = setTimeout(async () => {
                await this.removeMonitor(username, chatId);
                this.monitorTimeouts.delete(username);
            }, 2.5 * 60 * 1000);

            this.monitorTimeouts.set(username, timeoutId);

            this.analytics.capture({
                distinctId: chatId,
                event: "twitter_monitor_created",
                properties: {
                    username,
                    initialTweetCount: data.data.tweets.length,
                    action: "created",
                },
            });
        } catch (error) {
            console.error("Failed to add Twitter monitor:", error);
            throw error;
        }
    }

    async checkForNewTweets(monitor: {
        id: string;
        username: string;
        chatId: string;
    }): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/twitter/monitor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: monitor.username }),
            });

            const data = (await response.json()) as TwitterResponse;

            if (!data.success) {
                throw new Error("Failed to fetch Twitter data");
            }

            // Get existing tweet IDs for this monitor
            const existingTweets = await this.prisma.tweetRecord.findMany({
                where: { monitorId: monitor.id },
                select: { id: true },
            });
            const existingTweetIds = new Set(
                existingTweets.map((t: { id: string }) => t.id)
            );

            // Process new tweets
            for (const tweet of data.data.tweets) {
                if (!existingTweetIds.has(tweet.id)) {
                    // Store the new tweet
                    await this.prisma.tweetRecord.create({
                        data: {
                            id: tweet.id,
                            monitorId: monitor.id,
                            text: tweet.text,
                            createdAt: new Date(tweet.created_at),
                            metrics: tweet.public_metrics as Prisma.JsonObject,
                            mediaUrls: tweet.media?.map((m) => m.url) || [],
                        },
                    });

                    // Send notification
                    let message = `New tweet from @${monitor.username}:\n\n${tweet.text}`;

                    if (tweet.media && tweet.media.length > 0) {
                        message +=
                            "\n\nMedia attached: " +
                            tweet.media.map((m) => m.url).join("\n");
                    }

                    message += `\n\nMetrics:\n👍 ${tweet.public_metrics.like_count} likes\n🔄 ${tweet.public_metrics.retweet_count} retweets\n💬 ${tweet.public_metrics.reply_count} replies`;

                    // Add tweet link
                    message += `\n\nView tweet: https://twitter.com/${monitor.username}/status/${tweet.id}`;

                    await this.bot.telegram.sendMessage(
                        monitor.chatId,
                        message
                    );

                    this.analytics.capture({
                        distinctId: monitor.chatId,
                        event: "new_tweet_notification",
                        properties: {
                            username: monitor.username,
                            tweetId: tweet.id,
                        },
                    });
                }
            }

            // Update last checked timestamp
            await this.prisma.twitterMonitor.update({
                where: { id: monitor.id },
                data: { lastCheckedAt: new Date() },
            });
        } catch (error) {
            console.error(
                `Failed to check tweets for ${monitor.username}:`,
                error
            );
            throw error;
        }
    }

    async startPolling(intervalMs: number = 30000): Promise<void> {
        if (this.isPolling) {
            return; // Already polling
        }

        this.isPolling = true;

        setInterval(async () => {
            try {
                // Get all monitors
                const monitors = await this.prisma.twitterMonitor.findMany();

                // Check each monitor for new tweets
                for (const monitor of monitors) {
                    await this.checkForNewTweets(monitor);
                }
            } catch (error) {
                console.error("Error in Twitter polling loop:", error);
                // Continue polling even if there's an error
            }
        }, intervalMs);
    }

    async removeMonitor(username: string, chatId: string): Promise<void> {
        try {
            // Clear any existing timeout for this monitor
            const timeoutId = this.monitorTimeouts.get(username);
            if (timeoutId) {
                clearTimeout(timeoutId);
                this.monitorTimeouts.delete(username);
            }

            const monitor = await this.prisma.twitterMonitor.findFirst({
                where: { username, chatId },
            });

            if (!monitor) {
                throw new Error("Monitor not found");
            }

            // Delete all associated tweets first
            await this.prisma.tweetRecord.deleteMany({
                where: { monitorId: monitor.id },
            });

            // Then delete the monitor
            await this.prisma.twitterMonitor.delete({
                where: { id: monitor.id },
            });

            this.analytics.capture({
                distinctId: chatId,
                event: "twitter_monitor_removed",
                properties: {
                    username,
                },
            });

            await this.bot.telegram.sendMessage(
                chatId,
                `✅ Stopped monitoring Twitter account @${username}.\n\n` +
                `You can now monitor a different account!\n\n` +
                `🔜 Our upcoming paid plan will allow you to monitor multiple accounts simultaneously with extended durations.`
            );
        } catch (error) {
            console.error("Failed to remove Twitter monitor:", error);
            throw error;
        }
    }
}
