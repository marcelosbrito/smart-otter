import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScrollButtonProps {
  direction: 'left' | 'right';
  onScroll: () => void;
  disabled?: boolean;
  ariaLabel: string;
}

export default function ScrollButton({ direction, onScroll, disabled = false, ariaLabel }: ScrollButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 w-8 p-0 rounded-full shrink-0 transition-opacity ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-muted/50'}`}
      onClick={onScroll}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {direction === 'left' ? (
        <ChevronLeft className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </Button>
  );
}
