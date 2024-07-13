DROP TABLE "learning_material_files";--> statement-breakpoint
ALTER TABLE "classes" DROP CONSTRAINT "classes_thumbnail_id_files_file_id_fk";
--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "learning_material_id" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "assignment_id" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "submission_id" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "class_id" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "is_profile_picture" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_learning_material_id_learning_materials_material_id_fk" FOREIGN KEY ("learning_material_id") REFERENCES "public"."learning_materials"("material_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_assignment_id_assignments_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("assignment_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_submission_id_submissions_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("submission_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "classes" DROP COLUMN IF EXISTS "thumbnail_id";--> statement-breakpoint
ALTER TABLE "submissions" DROP COLUMN IF EXISTS "file_path";