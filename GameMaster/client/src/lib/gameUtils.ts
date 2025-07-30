import type { Difficulty, GameState } from "@shared/schema";

export function generateDailyWordIndex(difficulty: Difficulty, date: Date = new Date()): number {
  // Create a consistent seed based on date and difficulty
  const dateString = date.toDateString();
  const seed = (dateString + difficulty).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Return a deterministic index based on the seed
  return seed % 100; // Assuming we have up to 100 words per difficulty
}

export function formatGameTime(startTime: number | null, endTime: number | null = null): string {
  if (!startTime) return '00:00';
  
  const elapsed = Math.floor(((endTime || Date.now()) - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function calculateScore(gameState: GameState, timeSeconds: number): number {
  const baseScore = 1000;
  const difficultyMultiplier = {
    beginner: 1,
    intermediate: 1.5,
    advanced: 2
  };
  
  const difficulty = gameState.difficulty || 'beginner';
  const timeBonus = Math.max(0, 300 - timeSeconds); // Bonus for solving quickly
  const attemptPenalty = gameState.attempts * 50; // Penalty for wrong attempts
  const hintPenalty = gameState.hintsUsed * 100; // Penalty for using hints
  
  const score = Math.round(
    (baseScore + timeBonus - attemptPenalty - hintPenalty) * 
    difficultyMultiplier[difficulty]
  );
  
  return Math.max(0, score);
}

export function generateShareText(
  gameState: GameState,
  word: string,
  timeString: string,
  won: boolean
): string {
  const date = new Date().toLocaleDateString();
  const emoji = won ? '\u2705' : '\u274C'; // ✅ : ❌
  const result = won ? 'Solved' : 'Failed';
  
  return `🪙 BitWord ${date} 🪙
Difficulty: ${gameState.difficulty?.toUpperCase()}
Result: ${emoji} ${result}
Time: ${timeString}
Attempts: ${gameState.attempts}/${gameState.maxAttempts}
Word: ${word}

Play at: ${window.location.origin}`;
}

export function isValidLetter(letter: string): boolean {
  return /^[A-Z]$/.test(letter);
}

export function normalizeWord(word: string): string {
  return word.toUpperCase().replace(/[^A-Z]/g, '');
}

export function checkWinCondition(word: string, guessedLetters: string[]): boolean {
  return word.split('').every(letter => guessedLetters.includes(letter));
}

export function getNextDailyReset(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

export function getTimeUntilNextDaily(): string {
  const now = new Date();
  const nextReset = getNextDailyReset();
  const msUntilReset = nextReset.getTime() - now.getTime();
  
  const hours = Math.floor(msUntilReset / (1000 * 60 * 60));
  const minutes = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

export function getDifficultyIcon(difficulty: Difficulty): string {
  const icons = {
    beginner: '🌱',
    intermediate: '🏛️', 
    advanced: '🔧'
  };
  return icons[difficulty];
}

export function getDifficultyDescription(difficulty: Difficulty): string {
  const descriptions = {
    beginner: 'Basic Bitcoin terms like wallet, blockchain, and satoshi',
    intermediate: 'Austrian economics concepts and Bitcoin business models',
    advanced: 'Technical Bitcoin concepts, mining, and cryptography'
  };
  return descriptions[difficulty];
}
