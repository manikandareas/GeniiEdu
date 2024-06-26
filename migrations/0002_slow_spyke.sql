DO $$ BEGIN
 CREATE TYPE "public"."files_type" AS ENUM('image', 'video', 'pdf', 'youtube');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_material_files" (
	"learning_material_file_id" serial PRIMARY KEY NOT NULL,
	"learning_material_id" text NOT NULL,
	"file_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "images" RENAME TO "files";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "image_id" TO "file_id";--> statement-breakpoint
ALTER TABLE "classes" DROP CONSTRAINT "classes_thumbnail_id_images_image_id_fk";
--> statement-breakpoint
ALTER TABLE "files" DROP CONSTRAINT "images_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "type" "files_type" DEFAULT 'image' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_material_files" ADD CONSTRAINT "learning_material_files_learning_material_id_learning_materials_material_id_fk" FOREIGN KEY ("learning_material_id") REFERENCES "public"."learning_materials"("material_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_material_files" ADD CONSTRAINT "learning_material_files_file_id_files_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("file_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes" ADD CONSTRAINT "classes_thumbnail_id_files_file_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."files"("file_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "learning_materials" DROP COLUMN IF EXISTS "file_path";