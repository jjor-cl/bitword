import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  word: text("word").notNull(),
  isCompleted: boolean("is_completed").default(false),
  isWon: boolean("is_won").default(false),
  attempts: integer("attempts").default(0),
  hintsUsed: integer("hints_used").default(0),
  timeSeconds: integer("time_seconds"),
  guessedLetters: text("guessed_letters").array(),
  wrongLetters: text("wrong_letters").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameStats = pgTable("game_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  difficulty: text("difficulty").notNull(),
  totalGames: integer("total_games").default(0),
  totalWins: integer("total_wins").default(0),
  currentStreak: integer("current_streak").default(0),
  bestStreak: integer("best_streak").default(0),
  averageTime: integer("average_time"), // in seconds
  totalHints: integer("total_hints").default(0),
});

export const bitWords = pgTable("bit_words", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  definition: text("definition").notNull(),
  hint: text("hint").notNull(),
  funFact: text("fun_fact"),
  isActive: boolean("is_active").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
});

export const insertGameStatsSchema = createInsertSchema(gameStats).omit({
  id: true,
});

export const insertBitWordSchema = createInsertSchema(bitWords).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
export type InsertGameStats = z.infer<typeof insertGameStatsSchema>;
export type GameStats = typeof gameStats.$inferSelect;
export type InsertBitWord = z.infer<typeof insertBitWordSchema>;
export type BitWord = typeof bitWords.$inferSelect;

// Game state types
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  difficulty: Difficulty | null;
  currentWord: BitWord | null;
  guessedLetters: string[];
  wrongLetters: string[];
  status: GameStatus;
  attempts: number;
  maxAttempts: number;
  hintsUsed: number;
  startTime: number | null;
  endTime: number | null;
}

export interface GameResult {
  word: string;
  difficulty: Difficulty;
  isWon: boolean;
  timeSeconds: number;
  attempts: number;
  hintsUsed: number;
}
