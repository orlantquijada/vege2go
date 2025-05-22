import { sql } from "drizzle-orm";
import { pgEnum, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

const timestampFields = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp({ mode: "date", withTimezone: true }).$onUpdateFn(
		() => sql`now()`,
	),
};

export const Post = pgTable("posts", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	title: t.varchar({ length: 256 }).notNull(),
	createdAt: t.timestamp().defaultNow().notNull(),
	updatedAt: t
		.timestamp({ mode: "date", withTimezone: true })
		.$onUpdateFn(() => sql`now()`),
}));

export const CreatePostSchema = createInsertSchema(Post, {
	title: z.string().min(256),
}).pick({
	title: true,
});

export const userRoles = ["consumer", "producer", "logistics"] as const;
export type UserRole = (typeof userRoles)[number];
export const rolesEnum = pgEnum("user_roles", userRoles);

export const Profile = pgTable("users", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	// id generated in clerk
	userId: t.varchar({ length: 32 }).notNull().unique(),
	role: rolesEnum().notNull(),
	...timestampFields,
}));

export const CreateProfileSchema = createInsertSchema(Profile).pick({
	userId: true,
	role: true,
});
