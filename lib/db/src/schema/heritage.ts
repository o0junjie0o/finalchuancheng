import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const heritageItemsTable = pgTable("heritage_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  level: text("level").notNull(), // national, provincial, municipal
  category: text("category").notNull(),
  description: text("description").notNull(),
  shortDesc: text("short_desc").notNull(),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url"),
  origin: text("origin"),
  yearListed: integer("year_listed"),
  artisanCount: integer("artisan_count").default(0),
  tags: json("tags").$type<string[]>().default([]),
  featured: boolean("featured").default(false),
  xiaoTheme: boolean("xiao_theme").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHeritageItemSchema = createInsertSchema(heritageItemsTable).omit({ id: true, createdAt: true });
export type InsertHeritageItem = z.infer<typeof insertHeritageItemSchema>;
export type HeritageItem = typeof heritageItemsTable.$inferSelect;

export const artisansTable = pgTable("artisans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: text("level").notNull(), // national, provincial, municipal
  heritageItem: text("heritage_item").notNull(),
  heritageItemId: integer("heritage_item_id"),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  yearsOfPractice: integer("years_of_practice"),
  awards: json("awards").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertArtisanSchema = createInsertSchema(artisansTable).omit({ id: true, createdAt: true });
export type InsertArtisan = z.infer<typeof insertArtisanSchema>;
export type Artisan = typeof artisansTable.$inferSelect;

export const artisanServicesTable = pgTable("artisan_services", {
  id: serial("id").primaryKey(),
  artisanId: integer("artisan_id").notNull(),
  type: text("type").notNull(), // workshop, custom, course
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: text("duration"),
  maxParticipants: integer("max_participants"),
});

export const insertArtisanServiceSchema = createInsertSchema(artisanServicesTable).omit({ id: true });
export type InsertArtisanService = z.infer<typeof insertArtisanServiceSchema>;
export type ArtisanService = typeof artisanServicesTable.$inferSelect;

export const quizQuestionsTable = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: json("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, expert
  category: text("category"),
  points: integer("points").default(10),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestionsTable).omit({ id: true });
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestionsTable.$inferSelect;

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // artisan_original, collab, student
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  artisanName: text("artisan_name"),
  heritageItem: text("heritage_item"),
  stock: integer("stock").default(0),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("5.0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;

export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  imageUrl: text("image_url").notNull(),
  status: text("status").notNull(), // upcoming, ongoing, past
  registrationUrl: text("registration_url"),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activitiesTable).omit({ id: true, createdAt: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activitiesTable.$inferSelect;

export const quizLeaderboardTable = pgTable("quiz_leaderboard", {
  id: serial("id").primaryKey(),
  nickname: text("nickname").notNull(),
  correct: integer("correct").notNull(),
  time: integer("time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type QuizLeaderEntry = typeof quizLeaderboardTable.$inferSelect;
