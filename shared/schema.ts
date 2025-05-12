import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original users table kept for reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Chat message types
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Chat model settings
export interface ModelSettings {
  temperature: number;
  top_p: number;
  max_tokens: number;
  frequency_penalty: number;
  presence_penalty: number;
}
