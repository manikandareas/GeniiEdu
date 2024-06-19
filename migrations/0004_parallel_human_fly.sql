CREATE TABLE IF NOT EXISTS "images" (
	"image_id" text PRIMARY KEY NOT NULL,
	"file_path" text NOT NULL,
	"key" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes" ADD CONSTRAINT "classes_thumbnail_images_image_id_fk" FOREIGN KEY ("thumbnail") REFERENCES "public"."images"("image_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
