DO $$ BEGIN
 CREATE TYPE "public"."class_access_type" AS ENUM('public', 'private');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "class_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "access_type" "class_access_type" DEFAULT 'private';--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "thumbnail" text DEFAULT 'https://picsum.photos/1600/900';