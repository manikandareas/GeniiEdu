ALTER TABLE "assignment_personal_chats" DROP CONSTRAINT "assignment_personal_chats_sender_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "assignment_personal_chats" DROP CONSTRAINT "assignment_personal_chats_receiver_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "assignment_personal_chats" ADD COLUMN "student_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignment_personal_chats" ADD CONSTRAINT "assignment_personal_chats_student_id_users_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "assignment_personal_chats" DROP COLUMN IF EXISTS "sender_id";--> statement-breakpoint
ALTER TABLE "assignment_personal_chats" DROP COLUMN IF EXISTS "receiver_id";