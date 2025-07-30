-- CreateTable
CREATE TABLE "DiscordChannelMonitor" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "guildName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscordChannelMonitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordSubscription" (
    "id" TEXT NOT NULL,
    "discordUserId" TEXT NOT NULL,
    "discordUsername" TEXT NOT NULL,
    "telegramUsername" TEXT NOT NULL,
    "telegramChatId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "channelMonitorId" TEXT NOT NULL,

    CONSTRAINT "DiscordSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordMessageRecord" (
    "id" TEXT NOT NULL,
    "channelMonitorId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" JSONB NOT NULL,
    "embeds" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "notifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notificationsSent" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DiscordMessageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordEventMonitor" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "guildName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscordEventMonitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordEventSubscription" (
    "id" TEXT NOT NULL,
    "discordUserId" TEXT NOT NULL,
    "discordUsername" TEXT NOT NULL,
    "telegramUsername" TEXT NOT NULL,
    "telegramChatId" TEXT,
    "googleCalendarId" TEXT,
    "googleAccessToken" TEXT,
    "googleRefreshToken" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "syncToCalendar" BOOLEAN NOT NULL DEFAULT true,
    "sendNotifications" BOOLEAN NOT NULL DEFAULT true,
    "reminderMinutes" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventMonitorId" TEXT NOT NULL,

    CONSTRAINT "DiscordEventSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordEventRecord" (
    "id" TEXT NOT NULL,
    "eventMonitorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scheduledStartTime" TIMESTAMP(3) NOT NULL,
    "scheduledEndTime" TIMESTAMP(3),
    "location" TEXT,
    "creatorId" TEXT NOT NULL,
    "creatorUsername" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "coverImage" TEXT,
    "participantCount" INTEGER NOT NULL DEFAULT 0,
    "calendarEventId" TEXT,
    "discordCreatedAt" TIMESTAMP(3) NOT NULL,
    "notifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP(3),
    "notificationsSent" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DiscordEventRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenMonitor" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "targetPrice" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenMonitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordChannelMonitor_guildId_channelId_key" ON "DiscordChannelMonitor"("guildId", "channelId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordSubscription_discordUserId_channelMonitorId_key" ON "DiscordSubscription"("discordUserId", "channelMonitorId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordEventMonitor_guildId_key" ON "DiscordEventMonitor"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordEventSubscription_discordUserId_eventMonitorId_key" ON "DiscordEventSubscription"("discordUserId", "eventMonitorId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordEventRecord_id_key" ON "DiscordEventRecord"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TokenMonitor_chatId_token_key" ON "TokenMonitor"("chatId", "token");

-- AddForeignKey
ALTER TABLE "DiscordSubscription" ADD CONSTRAINT "DiscordSubscription_channelMonitorId_fkey" FOREIGN KEY ("channelMonitorId") REFERENCES "DiscordChannelMonitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordMessageRecord" ADD CONSTRAINT "DiscordMessageRecord_channelMonitorId_fkey" FOREIGN KEY ("channelMonitorId") REFERENCES "DiscordChannelMonitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordEventSubscription" ADD CONSTRAINT "DiscordEventSubscription_eventMonitorId_fkey" FOREIGN KEY ("eventMonitorId") REFERENCES "DiscordEventMonitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordEventRecord" ADD CONSTRAINT "DiscordEventRecord_eventMonitorId_fkey" FOREIGN KEY ("eventMonitorId") REFERENCES "DiscordEventMonitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
