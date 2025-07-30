import { Button } from "@/components/ui/button";

interface AlphabetGridProps {
  guessedLetters: string[];
  wrongLetters: string[];
  currentWord: string;
  onSelectLetter: (letter: string) => void;
  disabled: boolean;
}

export default function AlphabetGrid({
  guessedLetters,
  wrongLetters,
  currentWord,
  onSelectLetter,
  disabled
}: AlphabetGridProps) {
  
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const getLetterState = (letter: string) => {
    if (!guessedLetters.includes(letter)) return 'available';
    if (wrongLetters.includes(letter)) return 'wrong';
    if (currentWord.includes(letter)) return 'correct';
    return 'wrong';
  };

  const getLetterClasses = (letter: string) => {
    const state = getLetterState(letter);
    const baseClasses = "letter-btn w-8 h-8 md:w-10 md:h-10 font-bold transition-all duration-200 transform hover:scale-105 active:scale-95";
    
    switch (state) {
      case 'correct':
        return `${baseClasses} correct`;
      case 'wrong':
        return `${baseClasses} wrong`;
      default:
        return `${baseClasses} bg-bitcoin hover:bg-bitcoin-dark text-primary-foreground`;
    }
  };

  return (
    <div className="grid grid-cols-6 md:grid-cols-9 gap-2 max-w-2xl mx-auto">
      {alphabet.map((letter) => {
        const isUsed = guessedLetters.includes(letter);
        
        return (
          <Button
            key={letter}
            variant="ghost"
            className={getLetterClasses(letter)}
            onClick={() => onSelectLetter(letter)}
            disabled={disabled || isUsed}
          >
            {letter}
          </Button>
        );
      })}
    </div>
  );
}
