import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import type { GameStats } from "@shared/schema";

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  gameStats: GameStats[];
}

export default function StatsModal({ open, onClose, gameStats }: StatsModalProps) {
  
  const formatTime = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyStats = (difficulty: string) => {
    return gameStats.find(stat => stat.difficulty === difficulty);
  };

  const overallStats = {
    totalGames: gameStats.reduce((acc, stat) => acc + stat.totalGames, 0),
    totalWins: gameStats.reduce((acc, stat) => acc + stat.totalWins, 0),
    avgWinRate: gameStats.length > 0 
      ? Math.round(gameStats.reduce((acc, stat) => acc + (stat.totalWins / Math.max(stat.totalGames, 1) * 100), 0) / gameStats.length)
      : 0,
    bestStreak: Math.max(...gameStats.map(stat => stat.bestStreak), 0)
  };

  const difficulties = [
    { 
      id: 'beginner', 
      name: 'Beginner Level', 
      color: 'green-600',
      bgColor: 'green-600/10',
      borderColor: 'green-600/20'
    },
    { 
      id: 'intermediate', 
      name: 'Intermediate Level', 
      color: 'bitcoin',
      bgColor: 'bitcoin/10', 
      borderColor: 'bitcoin/20'
    },
    { 
      id: 'advanced', 
      name: 'Advanced Level', 
      color: 'red-600',
      bgColor: 'red-600/10',
      borderColor: 'red-600/20'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="crypto-card max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Your Statistics</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-bitcoin">{overallStats.totalGames}</div>
                <div className="text-sm text-muted-foreground">Games Played</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{overallStats.avgWinRate}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Difficulty-specific Stats */}
          <div className="space-y-4">
            {difficulties.map((difficulty) => {
              const stats = getDifficultyStats(difficulty.id);
              
              return (
                <Card 
                  key={difficulty.id}
                  className={`bg-${difficulty.bgColor} border border-${difficulty.borderColor}`}
                  style={{
                    backgroundColor: `hsl(var(--${difficulty.color})/0.1)`,
                    borderColor: `hsl(var(--${difficulty.color})/0.2)`
                  }}
                >
                  <CardContent className="p-4">
                    <h3 
                      className={`font-semibold mb-3 text-${difficulty.color}`}
                      style={{ color: `hsl(var(--${difficulty.color}))` }}
                    >
                      {difficulty.name}
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-bold">{stats?.totalWins || 0}</div>
                        <div className="text-muted-foreground">Wins</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{formatTime(stats?.averageTime || 0)}</div>
                        <div className="text-muted-foreground">Avg Time</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{stats?.bestStreak || 0}</div>
                        <div className="text-muted-foreground">Best Streak</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {gameStats.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-muted-foreground">
                Start playing to see your statistics!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
