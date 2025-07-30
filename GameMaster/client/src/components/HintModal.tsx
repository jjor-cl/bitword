import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HintModalProps {
  open: boolean;
  onClose: () => void;
  hint: string;
  onHintUsed: () => void;
}

export default function HintModal({ open, onClose, hint, onHintUsed }: HintModalProps) {
  
  const handleUseHint = () => {
    onHintUsed();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="crypto-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-bitcoin flex items-center">
            <span className="mr-2">💡</span>
            Hint
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <p className="text-muted-foreground">{hint}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-600/10 border border-blue-600/20">
            <CardContent className="p-3">
              <p className="text-sm text-blue-300 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Educational hints help you learn Bitcoin concepts while playing!
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button 
              onClick={handleUseHint}
              className="bg-bitcoin hover:bg-bitcoin-dark text-primary-foreground"
            >
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
