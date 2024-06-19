ALTER TABLE "classes" ADD CONSTRAINT "classes_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_key_unique" UNIQUE("key");