ALTER TABLE "submissions" ADD COLUMN "class_module_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_class_module_id_class_modules_class_module_id_fk" FOREIGN KEY ("class_module_id") REFERENCES "public"."class_modules"("class_module_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
