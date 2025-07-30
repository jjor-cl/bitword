import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WordDisplay from "./WordDisplay";
import AlphabetGrid from "./AlphabetGrid";
import type { GameState, BitWord } from "@shared/schema";

interface GameBoardProps {
  gameState: GameState;
  currentWord: BitWord;
  onSelectLetter: (letter: string) => void;
  onBackToDifficulty: () => void;
  onShowHint: () => void;
  isLoading: boolean;
}

export default function GameBoard({
  gameState,
  currentWord,
  onSelectLetter,
  onBackToDifficulty,
  onShowHint,
  isLoading
}: GameBoardProps) {
  
  const formatTime = (startTime: number | null) => {
    if (!startTime) return '00:00';
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600 text-white';
      case 'intermediate': return 'bg-bitcoin text-primary-foreground';
      case 'advanced': return 'bg-red-600 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="crypto-card">
      <CardContent className="p-6 md:p-8">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToDifficulty}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Button>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(gameState.difficulty || '')}`}>
                  {gameState.difficulty?.charAt(0).toUpperCase()}{gameState.difficulty?.slice(1)}
                </span>
                <span className="text-sm text-muted-foreground">Daily Challenge</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium">Attempts Remaining</div>
            <div className="flex space-x-1 mt-1">
              {Array.from({ length: gameState.maxAttempts }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < gameState.maxAttempts - gameState.attempts
                      ? 'bg-bitcoin'
                      : 'bg-red-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Word Display */}
        <div className="bg-card/50 rounded-lg p-6 mb-6 border border-border/50">
          <WordDisplay 
            word={currentWord.word}
            guessedLetters={gameState.guessedLetters}
            category={currentWord.category}
          />
          
          <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground mt-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>{gameState.maxAttempts - gameState.attempts} remaining</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(gameState.startTime)}</span>
            </div>
          </div>
        </div>

        {/* Alphabet Grid */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Select a letter:</h3>
          <AlphabetGrid
            guessedLetters={gameState.guessedLetters}
            wrongLetters={gameState.wrongLetters}
            currentWord={currentWord.word}
            onSelectLetter={onSelectLetter}
            disabled={isLoading}
          />
        </div>

        {/* Wrong Letters Display */}
        {gameState.wrongLetters.length > 0 && (
          <div className="mb-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">Wrong letters:</div>
            <div className="flex flex-wrap gap-2">
              {gameState.wrongLetters.map((letter) => (
                <span
                  key={letter}
                  className="bg-red-600/20 text-red-300 px-2 py-1 rounded text-sm line-through"
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onShowHint}
            disabled={gameState.hintsUsed >= 1}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Get Hint {gameState.hintsUsed >= 1 && '(Used)'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
