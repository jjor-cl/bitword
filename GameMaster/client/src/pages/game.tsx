import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DifficultySelector from "@/components/DifficultySelector";
import GameBoard from "@/components/GameBoard";
import GameComplete from "@/components/GameComplete";
import StatsModal from "@/components/StatsModal";
import HintModal from "@/components/HintModal";
import { useGame } from "@/hooks/useGame";
import type { Difficulty } from "@shared/schema";

export default function Game() {
  const [showStats, setShowStats] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es'>('en');
  const { toast } = useToast();

  const {
    gameState,
    currentWord,
    gameStats,
    isLoading,
    error,
    selectDifficulty,
    selectLetter,
    resetGame,
    completeGame
  } = useGame();

  const handleDifficultySelect = async (difficulty: Difficulty) => {
    try {
      await selectDifficulty(difficulty);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start game. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLetterSelect = (letter: string) => {
    if (gameState.status !== 'playing') return;
    
    const result = selectLetter(letter);
    
    if (result.correct) {
      toast({
        title: "Correct!",
        description: "Great guess!",
        className: "bg-green-600 text-white"
      });
    } else {
      toast({
        title: "Wrong letter",
        description: `${gameState.maxAttempts - gameState.attempts} attempts remaining`,
        variant: "destructive"
      });
    }

    if (result.gameComplete) {
      setTimeout(() => {
        completeGame(result.won, Date.now() - (gameState.startTime || 0));
      }, 1000);
    }
  };

  const handleBackToDifficulty = () => {
    resetGame();
  };

  const handleShowHint = () => {
    if (gameState.hintsUsed >= 1) {
      toast({
        title: "Hint limit reached",
        description: "You can only use one hint per game!",
        variant: "destructive"
      });
      return;
    }
    setShowHint(true);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="crypto-card p-8 text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Game</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Reload Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-bitcoin rounded-lg flex items-center justify-center animate-bitcoin-glow">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-foreground">
                <path fill="currentColor" d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546zm-6.35-4.613c.24-1.59-.97-2.45-2.62-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.7-.167-1.056-.246l.526-2.127-1.32-.33-.54 2.165c-.285-.065-.566-.13-.839-.196l.001-.009-1.815-.45-.35 1.407s.97.225.951.238c.53.135.625.486.608.766l-1.296 5.208c-.054.133-.19.336-.497.26.015.02-.951-.238-.951-.238l-.653 1.51 1.714.427c.318.08.63.163.937.241l-.546 2.19 1.314.33.54-2.16c.36.098.708.19 1.05.273l-.537 2.15 1.32.33.546-2.19c2.245.426 3.93.254 4.64-1.774.57-1.637-.028-2.578-1.21-3.192.862-.193 1.51-.756 1.684-1.917zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.73-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.09z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-bitcoin">BitWord</h1>
              <p className="text-sm text-muted-foreground">Daily Bitcoin Challenge</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'es')}
              className="bg-card text-foreground px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
            </select>
            
            <button 
              onClick={() => setShowStats(true)}
              className="bg-card hover:bg-card/80 p-2 rounded-lg transition-colors border border-border"
            >
              <svg className="w-5 h-5 text-bitcoin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto px-4 pb-8 space-y-6">
        {!gameState.difficulty && (
          <DifficultySelector 
            onSelectDifficulty={handleDifficultySelect}
            gameStats={gameStats}
            isLoading={isLoading}
          />
        )}

        {gameState.difficulty && gameState.status === 'playing' && currentWord && (
          <GameBoard
            gameState={gameState}
            currentWord={currentWord}
            onSelectLetter={handleLetterSelect}
            onBackToDifficulty={handleBackToDifficulty}
            onShowHint={handleShowHint}
            isLoading={isLoading}
          />
        )}

        {gameState.status !== 'playing' && currentWord && (
          <GameComplete
            gameState={gameState}
            currentWord={currentWord}
            onBackToDifficulty={handleBackToDifficulty}
            onNewGame={handleBackToDifficulty}
          />
        )}
      </main>

      {/* Modals */}
      <StatsModal 
        open={showStats}
        onClose={() => setShowStats(false)}
        gameStats={gameStats}
      />

      <HintModal
        open={showHint}
        onClose={() => setShowHint(false)}
        hint={currentWord?.hint || ''}
        onHintUsed={() => {
          // This would be handled in the game hook
          setShowHint(false);
        }}
      />
    </div>
  );
}
