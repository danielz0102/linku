CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"hashed_password" text NOT NULL,
	"profile_picture_url" text,
	"bio" text,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
