import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(), // Gera id automaticamente
    name: text().notNull(),
    email: text().notNull().unique(),
});

export const courses = pgTable("courses", {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull().unique(),
    description: text(),
});
