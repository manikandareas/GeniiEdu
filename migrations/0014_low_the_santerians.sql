ALTER TABLE "submissions" RENAME COLUMN "class_module_id" TO "class_modules_id";--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_class_module_id_class_modules_class_module_id_fk";
--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "class_modules_id" SET DATA TYPE integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_class_modules_id_class_modules_class_module_id_fk" FOREIGN KEY ("class_modules_id") REFERENCES "public"."class_modules"("class_module_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
