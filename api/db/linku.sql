CREATE TABLE "chat_members" (
	"chat_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "chat_members_chat_id_user_id_pk" PRIMARY KEY("chat_id","user_id")
);

CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_id" text,
	"public_url" text,
	CONSTRAINT "files_public_id_unique" UNIQUE("public_id")
);

CREATE TABLE "message_reads" (
	"message_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"read_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "message_reads_message_id_user_id_pk" PRIMARY KEY("message_id","user_id")
);

CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"text" text,
	"attachment_url" text,
	"attachment_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "messages_content_or_attachment_check" CHECK ("messages"."text" IS NOT NULL OR "messages"."attachment_url" IS NOT NULL)
);

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"hashed_password" text NOT NULL,
	"profile_picture_id" uuid,
	"bio" text,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "messages" ADD CONSTRAINT "messages_attachment_id_files_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "files"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "users" ADD CONSTRAINT "users_profile_picture_id_files_id_fk" FOREIGN KEY ("profile_picture_id") REFERENCES "files"("id") ON DELETE set null ON UPDATE no action;
CREATE INDEX "messages_sender_id_idx" ON "messages" USING btree ("sender_id");
CREATE INDEX "messages_chat_id_idx" ON "messages" USING btree ("chat_id");
CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
CREATE VIEW "users_view" AS (select "users"."id", "users"."first_name", "users"."last_name", "users"."username", "files"."public_url", "users"."bio" from "users" left join "files" on "files"."id" = "users"."profile_picture_id");
