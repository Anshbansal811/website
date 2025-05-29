-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phonenumber" INTEGER NOT NULL,
    "subject" TEXT,
    "message" TEXT,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "gst_pan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);
