ALTER TABLE "messages" RENAME COLUMN "content" TO "text";--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_content_or_attachment_check";--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_content_or_attachment_check" CHECK ("messages"."text" IS NOT NULL OR "messages"."attachment_url" IS NOT NULL);