-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);
