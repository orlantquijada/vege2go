CREATE TYPE "public"."user_roles" AS ENUM('consumer', 'producer', 'logistics');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"role" "user_roles" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "users_userId_unique" UNIQUE("user_id")
);
