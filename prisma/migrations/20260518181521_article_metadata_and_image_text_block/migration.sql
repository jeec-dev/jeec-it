-- AlterEnum
ALTER TYPE "ArticleBlockType" ADD VALUE 'IMAGE_TEXT';

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "metadata" JSONB;
