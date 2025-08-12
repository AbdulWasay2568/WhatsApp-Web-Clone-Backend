-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'Sent',
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ReplyReaction" (
    "id" SERIAL NOT NULL,
    "emoji" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "replyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReplyReaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReplyReaction" ADD CONSTRAINT "ReplyReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyReaction" ADD CONSTRAINT "ReplyReaction_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
