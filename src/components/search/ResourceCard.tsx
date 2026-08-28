import { ExternalLink, BookmarkPlus, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ResourceCardProps {
  name: string;
  url: string;
  explanation: string;
  categoryLabel: string;
  onSaveFavorite?: () => void;
  isSaved?: boolean;
  isAuthenticated?: boolean | null;
}

export default function ResourceCard({
  name,
  url,
  explanation,
  categoryLabel,
  onSaveFavorite,
  isSaved = false,
  isAuthenticated = null,
}: ResourceCardProps) {
  return (
    <div className="group relative flex-shrink-0 w-[320px] rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3 mb-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:underline flex items-center gap-1.5 break-all"
        >
          {name}
          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
        </a>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{explanation}</p>

      <div className="flex items-center justify-between pt-1">
        <Badge variant="secondary" className="text-xs rounded-full capitalize">
          {categoryLabel}
        </Badge>

        {isAuthenticated && onSaveFavorite ? (
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 transition-opacity ${isSaved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            onClick={(e) => { e.stopPropagation(); onSaveFavorite!(); }}
            aria-label={isSaved ? `${name} saved to favorites` : `Save ${name} to favorites`}
          >
            {isSaved ? (
              <Bookmark className="w-4 h-4 fill-current text-primary" />
            ) : (
              <BookmarkPlus className="w-4 h-4" />
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
