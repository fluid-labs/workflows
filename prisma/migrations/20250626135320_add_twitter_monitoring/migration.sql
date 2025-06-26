-- CreateTable
CREATE TABLE "TwitterMonitor" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwitterMonitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TweetRecord" (
    "id" TEXT NOT NULL,
    "monitorId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "notifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metrics" JSONB NOT NULL,
    "mediaUrls" TEXT[],

    CONSTRAINT "TweetRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TwitterMonitor_username_key" ON "TwitterMonitor"("username");

-- AddForeignKey
ALTER TABLE "TweetRecord" ADD CONSTRAINT "TweetRecord_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "TwitterMonitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
