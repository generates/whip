-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('email', 'password');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL DEFAULT E'email',
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account.email_unique" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account.username_unique" ON "Account"("username");

-- CreateIndex
CREATE INDEX "Account.email_index" ON "Account"("email");

-- CreateIndex
CREATE INDEX "Account.username_index" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Token.value_unique" ON "Token"("value");

-- CreateIndex
CREATE INDEX "Token.email_index" ON "Token"("email");

-- CreateIndex
CREATE INDEX "Token.accountId_index" ON "Token"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session.sid_unique" ON "Session"("sid");
