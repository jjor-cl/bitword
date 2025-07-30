import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { Difficulty, GameResult } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get daily BitWord for a specific difficulty
  app.get("/api/bitword/:difficulty", async (req, res) => {
    try {
      const difficulty = req.params.difficulty as Difficulty;
      
      if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
        return res.status(400).json({ message: "Invalid difficulty level" });
      }

      const bitWord = await storage.getTodaysBitWord(difficulty);
      
      if (!bitWord) {
        return res.status(404).json({ message: "No word found for this difficulty" });
      }

      res.json(bitWord);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch BitWord" });
    }
  });

  // Get all BitWords for a difficulty (for testing/admin)
  app.get("/api/bitwords/:difficulty", async (req, res) => {
    try {
      const difficulty = req.params.difficulty as Difficulty;
      
      if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
        return res.status(400).json({ message: "Invalid difficulty level" });
      }

      const bitWords = await storage.getBitWordsByDifficulty(difficulty);
      res.json(bitWords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch BitWords" });
    }
  });

  // Create a new game
  app.post("/api/games", async (req, res) => {
    try {
      const gameSchema = z.object({
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
        word: z.string(),
        userId: z.number().optional()
      });

      const validatedData = gameSchema.parse(req.body);
      
      // Check if user already has a game today for this difficulty
      const existingGame = await storage.getTodaysGame(validatedData.difficulty, validatedData.userId);
      if (existingGame) {
        return res.json(existingGame);
      }

      const game = await storage.createGame({
        ...validatedData,
        isCompleted: false,
        isWon: false,
        attempts: 0,
        hintsUsed: 0,
        timeSeconds: null,
        guessedLetters: [],
        wrongLetters: []
      });

      res.json(game);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  // Update game progress
  app.patch("/api/games/:id", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      
      const updateSchema = z.object({
        isCompleted: z.boolean().optional(),
        isWon: z.boolean().optional(),
        attempts: z.number().optional(),
        hintsUsed: z.number().optional(),
        timeSeconds: z.number().optional(),
        guessedLetters: z.array(z.string()).optional(),
        wrongLetters: z.array(z.string()).optional()
      });

      const validatedData = updateSchema.parse(req.body);
      const updatedGame = await storage.updateGame(gameId, validatedData);

      if (!updatedGame) {
        return res.status(404).json({ message: "Game not found" });
      }

      res.json(updatedGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update game" });
    }
  });

  // Submit game result and update stats
  app.post("/api/games/:id/complete", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      
      const resultSchema = z.object({
        isWon: z.boolean(),
        timeSeconds: z.number(),
        attempts: z.number(),
        hintsUsed: z.number(),
        userId: z.number().optional()
      });

      const result = resultSchema.parse(req.body);
      
      // Update the game
      const updatedGame = await storage.updateGame(gameId, {
        isCompleted: true,
        isWon: result.isWon,
        timeSeconds: result.timeSeconds,
        attempts: result.attempts,
        hintsUsed: result.hintsUsed
      });

      if (!updatedGame) {
        return res.status(404).json({ message: "Game not found" });
      }

      // Update stats
      const gameResult: GameResult = {
        word: updatedGame.word,
        difficulty: updatedGame.difficulty as Difficulty,
        isWon: result.isWon,
        timeSeconds: result.timeSeconds,
        attempts: result.attempts,
        hintsUsed: result.hintsUsed
      };

      const updatedStats = await storage.updateGameStats(
        updatedGame.difficulty as Difficulty,
        gameResult,
        result.userId
      );

      res.json({
        game: updatedGame,
        stats: updatedStats
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid result data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to complete game" });
    }
  });

  // Get game statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const difficulty = req.query.difficulty as Difficulty | undefined;

      if (difficulty) {
        if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
          return res.status(400).json({ message: "Invalid difficulty level" });
        }
        
        const stats = await storage.getGameStats(difficulty, userId);
        res.json(stats || null);
      } else {
        const allStats = await storage.getAllGameStats(userId);
        res.json(allStats);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Get today's game for a difficulty
  app.get("/api/games/today/:difficulty", async (req, res) => {
    try {
      const difficulty = req.params.difficulty as Difficulty;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
        return res.status(400).json({ message: "Invalid difficulty level" });
      }

      const game = await storage.getTodaysGame(difficulty, userId);
      res.json(game || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's game" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
