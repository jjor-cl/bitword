interface WordDisplayProps {
  word: string;
  guessedLetters: string[];
  category: string;
}

export default function WordDisplay({ word, guessedLetters, category }: WordDisplayProps) {
  return (
    <div className="text-center">
      <div className="flex justify-center flex-wrap gap-2 md:gap-3 mb-4">
        {word.split('').map((letter, index) => {
          const isRevealed = guessedLetters.includes(letter);
          return (
            <div
              key={index}
              className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl font-bold font-mono transition-all duration-300 letter-slot ${
                isRevealed ? 'revealed text-bitcoin border-bitcoin' : ''
              }`}
            >
              {isRevealed ? letter : '_'}
            </div>
          );
        })}
      </div>
      <div className="text-sm text-muted-foreground">
        <span>{category}</span> • <span>{word.length} letters</span>
      </div>
    </div>
  );
}
