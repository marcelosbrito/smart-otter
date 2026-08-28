import { useRef, useState, useEffect, useCallback } from 'react';
import ScrollButton from './ScrollButton';
import CategoryHeader from './CategoryHeader';
import ResourceCard from './ResourceCard';

interface Resource {
  name: string;
  url: string;
  explanation: string;
}

interface ResourceCategoryCarouselProps {
  label: string;
  resources: Resource[];
  onSaveFavorite?: (resourceName: string) => void;
  savedFavorites?: Set<string>;
  isAuthenticated?: boolean | null;
}

export default function ResourceCategoryCarousel({
  label,
  resources,
  onSaveFavorite,
  savedFavorites = new Set(),
  isAuthenticated = null,
}: ResourceCategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollWidth > el.clientWidth + el.scrollLeft + 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollPosition();
    el.addEventListener('scroll', checkScrollPosition, { passive: true });
    window.addEventListener('resize', checkScrollPosition);
    return () => {
      el.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 320;
    const gap = 16;
    const amount = cardWidth + gap;
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="mb-8">
      <CategoryHeader label={label} count={resources.length} />

      <div className="relative flex items-center gap-2">
        <ScrollButton
          direction="left"
          onScroll={() => scrollByAmount('left')}
          disabled={!showLeftArrow}
          ariaLabel={`Previous ${label.toLowerCase()} resources`}
        />

        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="region"
          aria-label={`${label} carousel`}
        >
          <div className="flex gap-4 py-2">
            {resources.map((item, idx) => (
              <ResourceCard
                key={idx}
                name={item.name}
                url={item.url}
                explanation={item.explanation}
                categoryLabel={label}
                onSaveFavorite={() => onSaveFavorite?.(item.name)}
                isSaved={savedFavorites.has(item.name)}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </div>

        <ScrollButton
          direction="right"
          onScroll={() => scrollByAmount('right')}
          disabled={!showRightArrow}
          ariaLabel={`Next ${label.toLowerCase()} resources`}
        />
      </div>
    </div>
  );
}
