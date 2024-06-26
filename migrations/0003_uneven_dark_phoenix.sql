ALTER TABLE "sessions" RENAME COLUMN "session_id" TO "id";--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "updated_at";