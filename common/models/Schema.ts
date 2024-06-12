import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

const RoleEnum = pgEnum("role", ["teacher", "student"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username"),
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  role: RoleEnum("role"),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
