import { google, calendar_v3 } from "googleapis";

export interface CalendarEvent {
    id?: string;
    summary: string;
    description?: string;
    startTime: Date;
    endTime?: Date;
    location?: string;
    reminders?: {
        useDefault: boolean;
        overrides?: Array<{
            method: "email" | "popup";
            minutes: number;
        }>;
    };
}

export interface CalendarSubscription {
    telegramChatId: string;
    telegramUsername: string;
    calendarId: string;
    accessToken: string;
    refreshToken: string;
}

export class GoogleCalendarService {
    private calendar: calendar_v3.Calendar;
    private oauth2Client: any;

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        this.calendar = google.calendar({
            version: "v3",
            auth: this.oauth2Client,
        });
    }

    /**
     * Get OAuth authorization URL for user to grant calendar access
     */
    getAuthUrl(telegramChatId: string): string {
        const scopes = [
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events",
        ];

        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
            state: telegramChatId, // Pass chat ID as state parameter
            prompt: "consent", // Force consent screen to ensure refresh token is returned
        });

        console.log("🔗 Generated OAuth URL:", authUrl);
        console.log("📋 Environment variables:");
        console.log("   • CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
        console.log("   • REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);

        return authUrl;
    }

    /**
     * Exchange authorization code for access tokens
     */
    async exchangeCodeForTokens(code: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        try {
            console.log("🔄 Exchanging authorization code for tokens...");
            const { tokens } = await this.oauth2Client.getToken(code);

            console.log("📋 Received tokens from Google:");
            console.log(
                "   • access_token:",
                tokens.access_token ? "✅ Present" : "❌ Missing"
            );
            console.log(
                "   • refresh_token:",
                tokens.refresh_token ? "✅ Present" : "❌ Missing"
            );
            console.log("   • expires_in:", tokens.expiry_date);

            if (!tokens.access_token) {
                throw new Error("No access token received from Google");
            }

            // If no refresh token, try to handle gracefully
            if (!tokens.refresh_token) {
                console.log(
                    "⚠️ No refresh token received. This might happen if user already authorized the app."
                );
                console.log(
                    "💡 You may need to revoke access in Google Account settings and try again."
                );
            }

            return {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token || "", // Use empty string if no refresh token
            };
        } catch (error) {
            console.error("❌ Error exchanging code for tokens:", error);
            if (error && typeof error === "object" && "response" in error) {
                const apiError = error as any;
                console.error(
                    "   • Response status:",
                    apiError.response?.status
                );
                console.error("   • Response data:", apiError.response?.data);
            }
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            throw new Error(
                `Failed to exchange authorization code: ${errorMessage}`
            );
        }
    }

    /**
     * Set credentials for API calls
     */
    setCredentials(accessToken: string, refreshToken: string) {
        this.oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
    }

    /**
     * Create a calendar event
     */
    async createEvent(
        calendarId: string,
        event: CalendarEvent
    ): Promise<string> {
        try {
            const calendarEvent: calendar_v3.Schema$Event = {
                summary: event.summary,
                description: event.description,
                start: {
                    dateTime: event.startTime.toISOString(),
                    timeZone: "UTC",
                },
                end: {
                    dateTime:
                        event.endTime?.toISOString() ||
                        new Date(
                            event.startTime.getTime() + 60 * 60 * 1000
                        ).toISOString(), // Default 1 hour duration
                    timeZone: "UTC",
                },
                location: event.location,
                reminders: event.reminders || {
                    useDefault: false,
                    overrides: [
                        { method: "popup", minutes: 30 },
                        { method: "email", minutes: 60 },
                    ],
                },
            };

            const response = await this.calendar.events.insert({
                calendarId: calendarId,
                requestBody: calendarEvent,
            });

            if (!response.data.id) {
                throw new Error("Failed to create calendar event");
            }

            return response.data.id;
        } catch (error) {
            console.error("Error creating calendar event:", error);
            throw new Error(`Failed to create calendar event: ${error}`);
        }
    }

    /**
     * Update an existing calendar event
     */
    async updateEvent(
        calendarId: string,
        eventId: string,
        event: CalendarEvent
    ): Promise<void> {
        try {
            const calendarEvent: calendar_v3.Schema$Event = {
                summary: event.summary,
                description: event.description,
                start: {
                    dateTime: event.startTime.toISOString(),
                    timeZone: "UTC",
                },
                end: {
                    dateTime:
                        event.endTime?.toISOString() ||
                        new Date(
                            event.startTime.getTime() + 60 * 60 * 1000
                        ).toISOString(),
                    timeZone: "UTC",
                },
                location: event.location,
                reminders: event.reminders || {
                    useDefault: false,
                    overrides: [
                        { method: "popup", minutes: 30 },
                        { method: "email", minutes: 60 },
                    ],
                },
            };

            await this.calendar.events.update({
                calendarId: calendarId,
                eventId: eventId,
                requestBody: calendarEvent,
            });
        } catch (error) {
            console.error("Error updating calendar event:", error);
            throw new Error(`Failed to update calendar event: ${error}`);
        }
    }

    /**
     * Delete a calendar event
     */
    async deleteEvent(calendarId: string, eventId: string): Promise<void> {
        try {
            await this.calendar.events.delete({
                calendarId: calendarId,
                eventId: eventId,
            });
        } catch (error) {
            console.error("Error deleting calendar event:", error);
            throw new Error(`Failed to delete calendar event: ${error}`);
        }
    }

    /**
     * Get user's calendar list
     */
    async getCalendarList(): Promise<
        Array<{
            id: string;
            summary: string;
            accessRole?: string;
            primary?: boolean;
        }>
    > {
        try {
            const response = await this.calendar.calendarList.list();

            if (!response.data.items) {
                return [];
            }

            return response.data.items.map((calendar) => ({
                id: calendar.id || "",
                summary: calendar.summary || "Unknown Calendar",
                accessRole: calendar.accessRole || undefined,
                primary: calendar.primary || false,
            }));
        } catch (error) {
            console.error("Error getting calendar list:", error);
            throw new Error(`Failed to get calendar list: ${error}`);
        }
    }

    /**
     * Get user's primary calendar with write access
     */
    async getPrimaryCalendar(): Promise<{
        id: string;
        summary: string;
    } | null> {
        try {
            const calendars = await this.getCalendarList();

            console.log("📋 Available calendars:");
            calendars.forEach((cal, index) => {
                console.log(`   ${index + 1}. ${cal.summary} (${cal.id})`);
                console.log(`      • Access: ${cal.accessRole}`);
                console.log(`      • Primary: ${cal.primary}`);
            });

            // First, try to find the primary calendar
            let primaryCalendar = calendars.find((cal) => cal.primary === true);

            if (primaryCalendar) {
                console.log(
                    `✅ Found primary calendar: ${primaryCalendar.summary}`
                );
                return {
                    id: primaryCalendar.id,
                    summary: primaryCalendar.summary,
                };
            }

            // If no primary flag, look for calendar with ID "primary"
            primaryCalendar = calendars.find((cal) => cal.id === "primary");

            if (primaryCalendar) {
                console.log(
                    `✅ Found primary calendar by ID: ${primaryCalendar.summary}`
                );
                return {
                    id: primaryCalendar.id,
                    summary: primaryCalendar.summary,
                };
            }

            // Fallback: find first calendar with owner/writer access
            primaryCalendar = calendars.find(
                (cal) =>
                    cal.accessRole === "owner" || cal.accessRole === "writer"
            );

            if (primaryCalendar) {
                console.log(
                    `✅ Found writable calendar: ${primaryCalendar.summary} (${primaryCalendar.accessRole})`
                );
                return {
                    id: primaryCalendar.id,
                    summary: primaryCalendar.summary,
                };
            }

            // If all else fails, try the first calendar
            if (calendars.length > 0) {
                console.log(
                    `⚠️ Using first calendar as fallback: ${calendars[0].summary}`
                );
                return { id: calendars[0].id, summary: calendars[0].summary };
            }

            throw new Error("No calendars found for user");
        } catch (error) {
            console.error("Error getting primary calendar:", error);
            throw new Error(`Failed to get primary calendar: ${error}`);
        }
    }

    /**
     * Check if access token is valid and refresh if needed
     */
    async ensureValidToken(refreshToken: string): Promise<string> {
        try {
            this.oauth2Client.setCredentials({
                refresh_token: refreshToken,
            });

            const { credentials } =
                await this.oauth2Client.refreshAccessToken();

            if (!credentials.access_token) {
                throw new Error("Failed to refresh access token");
            }

            return credentials.access_token;
        } catch (error) {
            console.error("Error refreshing access token:", error);
            throw new Error(`Failed to refresh access token: ${error}`);
        }
    }
}
