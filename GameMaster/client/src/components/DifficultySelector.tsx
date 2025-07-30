import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Difficulty, GameStats } from "@shared/schema";

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  gameStats: GameStats[];
  isLoading: boolean;
}

export default function DifficultySelector({ 
  onSelectDifficulty, 
  gameStats, 
  isLoading 
}: DifficultySelectorProps) {
  
  const getDifficultyStats = (difficulty: Difficulty) => {
    return gameStats.find(stat => stat.difficulty === difficulty);
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const difficulties = [
    {
      id: 'beginner' as Difficulty,
      icon: '🌱',
      title: 'Beginner',
      description: 'Basic Bitcoin terms and concepts',
      color: 'green',
      colorClasses: 'bg-green-600/20 border-green-600/30 hover:border-green-500 hover:shadow-green-500/20'
    },
    {
      id: 'intermediate' as Difficulty,
      icon: '🏛️',
      title: 'Intermediate', 
      description: 'Austrian economics & Bitcoin models',
      color: 'bitcoin',
      colorClasses: 'bg-bitcoin/20 border-bitcoin/30 hover:border-bitcoin hover:shadow-bitcoin/20'
    },
    {
      id: 'advanced' as Difficulty,
      icon: '🔧',
      title: 'Advanced',
      description: 'Technical concepts & mining',
      color: 'red',
      colorClasses: 'bg-red-600/20 border-red-600/30 hover:border-red-500 hover:shadow-red-500/20'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="crypto-card">
          <CardContent className="p-6">
            <Skeleton className="h-8 w-64 mx-auto mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="crypto-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-bitcoin">
              {gameStats.reduce((acc, stat) => acc + stat.currentStreak, 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Current Streak</div>
          </CardContent>
        </Card>
        <Card className="crypto-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {gameStats.reduce((acc, stat) => acc + stat.totalWins, 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Words Solved</div>
          </CardContent>
        </Card>
        <Card className="crypto-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {formatTime(gameStats.reduce((acc, stat) => acc + (stat.averageTime || 0), 0) / gameStats.length || 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Avg Time</div>
          </CardContent>
        </Card>
        <Card className="crypto-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(gameStats.reduce((acc, stat) => acc + (stat.totalWins / Math.max(stat.totalGames, 1) * 100), 0) / gameStats.length || 0)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Win Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Selection */}
      <Card className="crypto-card">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Choose Your Challenge</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficulties.map((difficulty) => {
              const stats = getDifficultyStats(difficulty.id);
              
              return (
                <Button
                  key={difficulty.id}
                  variant="ghost"
                  className={`difficulty-card h-auto p-0 ${difficulty.colorClasses}`}
                  onClick={() => onSelectDifficulty(difficulty.id)}
                >
                  <div className="w-full p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{difficulty.icon}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        difficulty.color === 'green' ? 'bg-green-600 text-white' :
                        difficulty.color === 'bitcoin' ? 'bg-bitcoin text-primary-foreground' :
                        'bg-red-600 text-white'
                      }`}>
                        Level {difficulties.indexOf(difficulty) + 1}
                      </span>
                    </div>
                    <h3 className={`font-semibold mb-2 ${
                      difficulty.color === 'green' ? 'text-green-300' :
                      difficulty.color === 'bitcoin' ? 'text-bitcoin' :
                      'text-red-300'
                    }`}>
                      {difficulty.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {difficulty.description}
                    </p>
                    <div className="flex items-center justify-center text-xs text-muted-foreground">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatTime(stats?.averageTime || 0)} avg</span>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
