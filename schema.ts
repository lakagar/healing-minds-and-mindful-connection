import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  language: text("language").default("en"),
  theme: text("theme").default("light"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
});

// Mood tracking table
export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mood: text("mood").notNull(),
  note: text("note"),
  date: timestamp("date").defaultNow().notNull(),
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).pick({
  userId: true,
  mood: true,
  note: true,
  date: true,
});

// Medicine table
export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  rating: integer("rating").default(0),
  ratingCount: integer("rating_count").default(0),
  inStock: boolean("in_stock").default(true),
});

export const insertMedicineSchema = createInsertSchema(medicines).pick({
  name: true,
  description: true,
  category: true,
  price: true,
  rating: true,
  ratingCount: true,
  inStock: true,
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  medicineId: integer("medicine_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  medicineId: true,
  quantity: true,
});

// Therapists table
export const therapists = pgTable("therapists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  bio: text("bio").notNull(),
  available: boolean("available").default(true),
});

export const insertTherapistSchema = createInsertSchema(therapists).pick({
  name: true,
  specialization: true,
  bio: true,
  available: true,
});

// Sessions table
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  therapistId: integer("therapist_id").notNull(),
  sessionDate: timestamp("session_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  sessionType: text("session_type").notNull(), // individual or group
  status: text("status").default("scheduled"), // scheduled, completed, canceled
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  userId: true,
  therapistId: true,
  sessionDate: true,
  duration: true,
  sessionType: true,
  status: true,
});

// Group sessions table
export const groupSessions = pgTable("group_sessions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  therapistId: integer("therapist_id").notNull(),
  sessionDate: timestamp("session_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").default(0),
  status: text("status").default("scheduled"), // scheduled, completed, canceled
});

export const insertGroupSessionSchema = createInsertSchema(groupSessions).pick({
  name: true,
  description: true,
  therapistId: true,
  sessionDate: true,
  duration: true,
  maxParticipants: true,
  currentParticipants: true,
  status: true,
});

// Group session participants table
export const groupSessionParticipants = pgTable("group_session_participants", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  userId: integer("user_id").notNull(),
});

export const insertGroupSessionParticipantSchema = createInsertSchema(groupSessionParticipants).pick({
  sessionId: true,
  userId: true,
});

// Chat history table
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).pick({
  userId: true,
  message: true,
  response: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;

export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type Medicine = typeof medicines.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertTherapist = z.infer<typeof insertTherapistSchema>;
export type Therapist = typeof therapists.$inferSelect;

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export type InsertGroupSession = z.infer<typeof insertGroupSessionSchema>;
export type GroupSession = typeof groupSessions.$inferSelect;

export type InsertGroupSessionParticipant = z.infer<typeof insertGroupSessionParticipantSchema>;
export type GroupSessionParticipant = typeof groupSessionParticipants.$inferSelect;

export type InsertChatHistory = z.infer<typeof insertChatHistorySchema>;
export type ChatHistory = typeof chatHistory.$inferSelect;
