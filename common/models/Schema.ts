import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { uuidv7 } from "uuidv7";

const customUniqueID = (identifier: string, size: number = 15) =>
  `${identifier}${nanoid(size)}`;

export const RoleEnum = pgEnum("role", ["teacher", "student"]);
export const createdAt = timestamp("created_at", {
  mode: "string",
}).defaultNow();
export const updatedAt = timestamp("updated_at", {
  mode: "string",
}).defaultNow();

export const users = pgTable("users", {
  id: text("user_id")
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  username: text("username"),
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  role: RoleEnum("role"),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  createdAt,
  updatedAt,
});
