## 1. Typography — TASA Orbiter Font Application

- [x] 1.1 Define `@font-face` declarations for TASA Orbiter (weights 400, 500, 600, 700) in the global CSS file or layout component style block
- [x] 1.2 Apply TASA Orbiter as the default font-family across all UI elements via Tailwind config or root-level CSS `font-family` declaration
- [x] 1.3 Verify font renders correctly on headings, body text, buttons, navigation, labels, and metadata
- [x] 1.4 Ensure `font-display: swap` is set to prevent FOIT; confirm system font fallback stack is defined

## 2. Carousel Component Extraction

- [x] 2.1 Create `ScrollButton` component with left/right chevron icons from `lucide-react`, disabled state logic, and keyboard accessibility
- [x] 2.2 Create `ResourceCard` component displaying resource name (with external link), explanation text (clamped to 2 lines), category label, and favorite button
- [x] 2.3 Create `CategoryHeader` component showing the category title and contextual description
- [x] 2.4 Create `ResourceCategoryCarousel` component that wraps a scroll container (`useRef`), renders header + scroll buttons + card row

## 3. Search Page Integration

- [x] 3.1 Replace existing collapsible resource sections in `src/app/search/page.tsx` with four `<ResourceCategoryCarousel>` instances (Tools, Communities, Learning Platforms, Documentation)
- [x] 3.2 Pass each category's resources from `results[cat.key]` to the corresponding carousel component
- [x] 3.3 Wire existing `handleSaveFavorite(...)` and `savedFavorites` state into the favorite button on each card
- [x] 3.4 Preserve URL parameter handling (`?q=...`, `?category=...`) — ensure category filter still works with new layout
- [x] 3.5 Ensure loading states (skeletons) and error states continue to display correctly during carousel rendering

## 4. Carousel Navigation Logic

- [x] 4.1 Implement scroll position checking for each carousel's arrow buttons (disabled when `scrollLeft === 0` or at end boundary with epsilon tolerance)
- [x] 4.2 Bind scroll event listeners on each carousel container to update button disabled states reactively
- [x] 4.3 Ensure each category has its own independent scroll reference (`toolsCarouselRef`, `communitiesCarouselRef`, etc.)

## 5. Responsive Layout

- [x] 5.1 Desktop (>1024px): configure multiple cards visible per carousel row with appropriate gap spacing
- [x] 5.2 Tablet (640–1024px): reduce visible card count, preserve horizontal navigation
- [x] 5.3 Mobile (<640px): single card per view with swipe support; ensure no horizontal overflow on the page body

## 6. Accessibility Verification

- [x] 6.1 Verify all carousel navigation buttons have meaningful `aria-label` attributes (e.g., "Previous Tools resources", "Next Tools resources")
- [x] 6.2 Verify visible focus states on all interactive elements (buttons, links, cards)
- [x] 6.3 Verify external resource links use `target="_blank"` and `rel="noopener noreferrer"`
- [x] 6.4 Verify keyboard navigation order through carousel controls and card content

## 7. Testing and Validation

- [x] 7.1 Run `npx eslint . --ext .ts,.tsx` — verify no lint errors introduced
- [x] 7.2 Run `npm run build` — verify production build succeeds without errors
- [x] 7.3 Verify search page loads correctly at `/search?q=Frontend+Developer`
- [x] 7.4 Verify all four categories display carousels with correct resources
- [x] 7.5 Verify each carousel navigates independently (scrolling Tools does not affect Communities)
- [x] 7.6 Verify favorites continue working from carousel cards
- [x] 7.7 Verify external links open in new tabs correctly
- [x] 7.8 Verify loading and error states render properly during carousel display
- [x] 7.9 Verify cache/provider behavior is unaffected (no changes to API, service layer, or cache)
