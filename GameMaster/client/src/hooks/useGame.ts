import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GameState, BitWord, Difficulty, GameStats, Game } from "@shared/schema";

const MAX_ATTEMPTS = 3;

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    difficulty: null,
    currentWord: null,
    guessedLetters: [],
    wrongLetters: [],
    status: 'playing',
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    hintsUsed: 0,
    startTime: null,
    endTime: null
  });

  const queryClient = useQueryClient();

  // Query for game statistics
  const { data: gameStats = [] } = useQuery<GameStats[]>({
    queryKey: ['/api/stats'],
    retry: false
  });

  // Query for current word when difficulty is selected
  const { data: currentWord, isLoading: isLoadingWord, error } = useQuery<BitWord>({
    queryKey: ['/api/bitword', gameState.difficulty],
    queryFn: async () => {
      const response = await fetch(`/api/bitword/${gameState.difficulty}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch word: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!gameState.difficulty,
    retry: false
  });

  // Query for today's game if it exists
  const { data: todaysGame } = useQuery<Game | null>({
    queryKey: ['/api/games/today', gameState.difficulty],
    queryFn: async () => {
      const response = await fetch(`/api/games/today/${gameState.difficulty}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch game: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!gameState.difficulty,
    retry: false
  });

  // Mutation to create/update game
  const createGameMutation = useMutation({
    mutationFn: async (gameData: { difficulty: Difficulty; word: string }) => {
      const response = await apiRequest('POST', '/api/games', gameData);
      return response.json();
    },
    onSuccess: (data: Game) => {
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
    }
  });

  // Mutation to complete game
  const completeGameMutation = useMutation({
    mutationFn: async (params: { 
      gameId: number; 
      result: { 
        isWon: boolean; 
        timeSeconds: number; 
        attempts: number; 
        hintsUsed: number; 
      }; 
    }) => {
      const response = await apiRequest('POST', `/api/games/${params.gameId}/complete`, params.result);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
    }
  });

  // Update game state when current word changes
  useEffect(() => {
    if (currentWord && gameState.difficulty && todaysGame !== undefined) {
      // Check if today's game is already completed
      if (todaysGame && todaysGame.isCompleted) {
        // Game already completed - show results
        const gameLetters = currentWord.word.split('');
        const allLetters = gameLetters.filter((letter, index, arr) => arr.indexOf(letter) === index);
        
        setGameState(prev => ({
          ...prev,
          currentWord,
          status: (todaysGame.isWon ? 'won' : 'lost') as 'won' | 'lost',
          guessedLetters: todaysGame.guessedLetters || allLetters,
          wrongLetters: todaysGame.wrongLetters || [],
          attempts: todaysGame.attempts ?? 0,
          hintsUsed: todaysGame.hintsUsed ?? 0,
          startTime: todaysGame.createdAt ? new Date(todaysGame.createdAt).getTime() : Date.now(),
          endTime: Date.now() // Mark as completed
        }));
      } else if (todaysGame && !todaysGame.isCompleted) {
        // Game exists but not completed - resume game
        setGameState(prev => ({
          ...prev,
          currentWord,
          status: 'playing',
          guessedLetters: todaysGame.guessedLetters || [],
          wrongLetters: todaysGame.wrongLetters || [],
          attempts: todaysGame.attempts ?? 0,
          hintsUsed: todaysGame.hintsUsed ?? 0,
          startTime: todaysGame.createdAt ? new Date(todaysGame.createdAt).getTime() : Date.now(),
          endTime: null
        }));
      } else {
        // No game exists - start new game
        setGameState(prev => ({
          ...prev,
          currentWord,
          status: 'playing',
          guessedLetters: [],
          wrongLetters: [],
          attempts: 0,
          hintsUsed: 0,
          startTime: Date.now(),
          endTime: null
        }));

        // Create new game
        createGameMutation.mutate({
          difficulty: gameState.difficulty,
          word: currentWord.word
        });
      }
    }
  }, [currentWord, gameState.difficulty, todaysGame]);

  const selectDifficulty = useCallback(async (difficulty: Difficulty) => {
    setGameState({
      difficulty,
      currentWord: null,
      guessedLetters: [],
      wrongLetters: [],
      status: 'playing',
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      hintsUsed: 0,
      startTime: null,
      endTime: null
    });
  }, []);

  const selectLetter = useCallback((letter: string) => {
    if (!currentWord || gameState.status !== 'playing' || gameState.guessedLetters.includes(letter)) {
      return { correct: false, gameComplete: gameState.status !== 'playing', won: gameState.status === 'won' };
    }

    const newGuessedLetters = [...gameState.guessedLetters, letter];
    const isCorrect = currentWord.word.includes(letter);
    let newWrongLetters = [...gameState.wrongLetters];
    let newAttempts = gameState.attempts;

    if (!isCorrect) {
      newWrongLetters.push(letter);
      newAttempts++;
    }

    // Check win condition
    const allLettersGuessed = currentWord.word.split('').every(wordLetter => 
      newGuessedLetters.includes(wordLetter)
    );

    // Check lose condition
    const gameComplete = allLettersGuessed || newAttempts >= MAX_ATTEMPTS;
    const won = allLettersGuessed && newAttempts < MAX_ATTEMPTS;

    setGameState(prev => ({
      ...prev,
      guessedLetters: newGuessedLetters,
      wrongLetters: newWrongLetters,
      attempts: newAttempts,
      status: gameComplete ? (won ? 'won' : 'lost') : 'playing',
      endTime: gameComplete ? Date.now() : null
    }));

    return { correct: isCorrect, gameComplete, won };
  }, [currentWord, gameState]);

  const resetGame = useCallback(() => {
    setGameState({
      difficulty: null,
      currentWord: null,
      guessedLetters: [],
      wrongLetters: [],
      status: 'playing',
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      hintsUsed: 0,
      startTime: null,
      endTime: null
    });
  }, []);

  const completeGame = useCallback(async (won: boolean, timeSeconds: number) => {
    if (!todaysGame || !gameState.startTime) return;

    const result = {
      isWon: won,
      timeSeconds: Math.floor(timeSeconds / 1000),
      attempts: gameState.attempts,
      hintsUsed: gameState.hintsUsed
    };

    try {
      await completeGameMutation.mutateAsync({
        gameId: todaysGame.id,
        result
      });
    } catch (error) {
      console.error('Failed to complete game:', error);
    }
  }, [todaysGame, gameState, completeGameMutation]);

  return {
    gameState,
    currentWord,
    gameStats,
    isLoading: isLoadingWord || createGameMutation.isPending || completeGameMutation.isPending,
    error: error?.message,
    selectDifficulty,
    selectLetter,
    resetGame,
    completeGame
  };
}
