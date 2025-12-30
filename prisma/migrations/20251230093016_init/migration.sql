-- CreateTable
CREATE TABLE "Paste" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAtMs" BIGINT NOT NULL,
    "expiresAtMs" BIGINT,
    "maxViews" INTEGER,
    "viewsUsed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Paste_pkey" PRIMARY KEY ("id")
);
