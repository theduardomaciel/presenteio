-- CreateEnum
CREATE TYPE "Color" AS ENUM ('PURPLE', 'BLUE', 'GREEN', 'YELLOW', 'RED', 'PINK', 'ORANGE', 'BROWN', 'GREY');

-- CreateEnum
CREATE TYPE "GuestStatus" AS ENUM ('PENDING', 'CONFIRMED', 'VISUALIZED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'DIVULGED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SORTEIO', 'AMIGOSECRETO');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "image_url" TEXT,
    "image_deleteHash" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inviteCode" TEXT NOT NULL,
    "type" "EventType" NOT NULL DEFAULT 'AMIGOSECRETO',
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" "Color" NOT NULL DEFAULT 'RED',
    "image_url" TEXT,
    "image_deleteHash" TEXT,
    "minPrice" DOUBLE PRECISION,
    "maxPrice" DOUBLE PRECISION,
    "allowInvite" BOOLEAN NOT NULL DEFAULT false,
    "allowRevealFromPage" BOOLEAN NOT NULL DEFAULT false,
    "allowEmailChange" BOOLEAN NOT NULL DEFAULT false,
    "allowProfileChange" BOOLEAN NOT NULL DEFAULT false,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "image_url" TEXT,
    "image_deleteHash" TEXT,
    "status" "GuestStatus" NOT NULL DEFAULT 'PENDING',
    "guestId" TEXT,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "events_inviteCode_key" ON "events"("inviteCode");

-- CreateIndex
CREATE INDEX "events_accountId_idx" ON "events"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "guests_guestId_key" ON "guests"("guestId");

-- CreateIndex
CREATE INDEX "guests_eventId_idx" ON "guests"("eventId");
