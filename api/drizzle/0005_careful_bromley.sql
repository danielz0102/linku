CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_url" text,
	"public_id" text
);
--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "attachment_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_picture_id" uuid;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_attachment_id_files_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_profile_picture_id_files_id_fk" FOREIGN KEY ("profile_picture_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;