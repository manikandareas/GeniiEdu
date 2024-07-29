ALTER TABLE "assignment_personal_chats" RENAME TO "assignment_personal_comments";--> statement-breakpoint
ALTER TABLE "messages" RENAME TO "comments";--> statement-breakpoint
ALTER TABLE "assignment_personal_comments" RENAME COLUMN "room_chat_id" TO "assignment_personal_comment_id";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "message_id" TO "comment_id";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "room_chat_id" TO "room_id";--> statement-breakpoint
ALTER TABLE "assignment_personal_comments" DROP CONSTRAINT "assignment_personal_chats_assignment_id_assignments_assignment_id_fk";
--> statement-breakpoint
ALTER TABLE "assignment_personal_comments" DROP CONSTRAINT "assignment_personal_chats_student_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "messages_room_chat_id_assignment_personal_chats_room_chat_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "messages_sender_id_users_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignment_personal_comments" ADD CONSTRAINT "assignment_personal_comments_assignment_id_assignments_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("assignment_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignment_personal_comments" ADD CONSTRAINT "assignment_personal_comments_student_id_users_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_room_id_assignment_personal_comments_assignment_personal_comment_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."assignment_personal_comments"("assignment_personal_comment_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_sender_id_users_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
