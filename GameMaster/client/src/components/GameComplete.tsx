import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { GameState, BitWord } from "@shared/schema";

interface GameCompleteProps {
  gameState: GameState;
  currentWord: BitWord;
  onBackToDifficulty: () => void;
  onNewGame: () => void;
}

export default function GameComplete({
  gameState,
  currentWord,
  onBackToDifficulty,
  onNewGame
}: GameCompleteProps) {
  const { toast } = useToast();
  const isWon = gameState.status === 'won';

  const formatTime = () => {
    if (!gameState.startTime || !gameState.endTime) return '0:00';
    const seconds = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shareText = `🪙 BitWord ${new Date().toLocaleDateString()} 🪙
Difficulty: ${gameState.difficulty?.toUpperCase()}
Result: ${isWon ? '✅ Solved' : '❌ Failed'}
Time: ${formatTime()}
Attempts: ${gameState.attempts}/${gameState.maxAttempts}
Word: ${currentWord.word}

Play at: ${window.location.origin}`;

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'copy') => {
    const encodedText = encodeURIComponent(shareText);
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareText).then(() => {
          toast({
            title: "Copied!",
            description: "Share text copied to clipboard",
            className: "bg-green-600 text-white"
          });
        });
        break;
    }
  };

  return (
    <Card className="crypto-card">
      <CardContent className="p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {isWon ? (
              <div className="text-bitcoin animate-bounce-subtle">🏆</div>
            ) : (
              <div className="text-red-500">💔</div>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isWon ? 'Congratulations!' : 'Game Over'}
          </h2>
          <p className="text-muted-foreground">
            {isWon 
              ? `You've completed today's ${gameState.difficulty} challenge!`
              : `Better luck tomorrow! The word was ${currentWord.word}`
            }
          </p>
        </div>

        {/* Word Explanation */}
        <div className="bg-card/50 rounded-lg p-4 mb-6 border border-border/50">
          <h3 className="font-semibold text-bitcoin mb-3 flex items-center">
            <span className="mr-2">📚</span>
            Educational Insight
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Word:</strong> <span className="text-bitcoin">{currentWord.word}</span>
            </p>
            <p>
              <strong>Definition:</strong> <span className="text-muted-foreground">{currentWord.definition}</span>
            </p>
            {currentWord.funFact && (
              <p>
                <strong>Fun Fact:</strong> <span className="text-muted-foreground">{currentWord.funFact}</span>
              </p>
            )}
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card/50 rounded-lg p-3 text-center border border-border/50">
            <div className="text-2xl font-bold text-bitcoin">{formatTime()}</div>
            <div className="text-xs text-muted-foreground">Time</div>
          </div>
          <div className="bg-card/50 rounded-lg p-3 text-center border border-border/50">
            <div className="text-2xl font-bold text-green-400">
              {gameState.attempts}/{gameState.maxAttempts}
            </div>
            <div className="text-xs text-muted-foreground">Attempts</div>
          </div>
          <div className="bg-card/50 rounded-lg p-3 text-center border border-border/50">
            <div className="text-2xl font-bold text-blue-400">{gameState.hintsUsed}</div>
            <div className="text-xs text-muted-foreground">Hints</div>
          </div>
          <div className="bg-card/50 rounded-lg p-3 text-center border border-border/50">
            <div className="text-2xl font-bold text-purple-400">
              {gameState.difficulty?.charAt(0).toUpperCase()}{gameState.difficulty?.slice(1)}
            </div>
            <div className="text-xs text-muted-foreground">Level</div>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="text-center border-t border-border/50 pt-6">
          <h3 className="font-medium mb-4">Share your BitWord success!</h3>
          <div className="flex justify-center space-x-4 mb-4">
            <Button
              onClick={() => handleShare('whatsapp')}
              className="bg-green-600 hover:bg-green-700 p-3"
              size="sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.31 20.62C8.75 21.39 10.36 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2Z"/>
              </svg>
            </Button>
            <Button
              onClick={() => handleShare('twitter')}
              className="bg-blue-500 hover:bg-blue-600 p-3"
              size="sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Button>
            <Button
              onClick={() => handleShare('copy')}
              className="bg-card hover:bg-card/80 p-3 border border-border"
              size="sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Button>
          </div>
          <Button
            onClick={onBackToDifficulty}
            className="bg-bitcoin hover:bg-bitcoin-dark text-primary-foreground font-medium"
          >
            Play Another Level
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
