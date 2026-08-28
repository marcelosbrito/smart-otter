## ADDED Requirements

### Requirement: Enhanced Result Card Design

Feature: Smart Otter — Search Results

Each search result MUST be displayed inside a polished card component with clear visual hierarchy, hover states, and action buttons (bookmark/favorite). Cards must animate smoothly on appearance and support responsive reflow.

#### Scenario: Result cards display with polished styling

- **GIVEN** search results have loaded for a profession query
- **WHEN** the user views each category section
- **THEN** every resource appears inside a card with rounded corners, subtle border/shadow, and adequate padding
- **AND** the resource name is styled as a prominent clickable link that opens in a new tab

#### Scenario: Cards show hover and focus states

- **GIVEN** a user hovers over or focuses on a result card with keyboard navigation
- **WHEN** they interact with it
- **THEN** the card highlights subtly (background color shift or border glow) to indicate interactivity
- **AND** the bookmark button visually indicates saved vs. unsaved state

#### Scenario: Result cards animate in on load

- **GIVEN** search results have just loaded from the AI provider
- **WHEN** the page renders the result cards
- **THEN** each card fades in with a staggered animation (each card delayed 50–100ms after the previous)
- **AND** the total entrance animation completes within 400ms

### Requirement: Category Grouping UI

Results MUST be grouped by category (Tools, Communities, Learning Platforms, Documentation) with collapsible sections. Each section header shows the category name and resource count. Empty categories are hidden entirely.

#### Scenario: Collapsible category sections expand/collapse smoothly

- **GIVEN** search results are displayed with multiple categories
- **WHEN** a user clicks a category header to toggle it
- **THEN** the content area expands or collapses over 150–200ms
- **AND** an chevron icon rotates to indicate open/closed state

#### Scenario: Category headers show resource counts

- **GIVEN** search results are loaded for "Data Engineer"
- **WHEN** the user views the category section headers
- **THEN** each header displays the count of resources (e.g., "Tools (5)")
- **AND** only categories with at least one resource are visible

### Requirement: Provider Attribution Badges

Every result set MUST display a small badge or metadata line indicating which AI provider served the response. If a fallback was used, it must show the actual chain that resolved the query.

#### Scenario: Badge shows primary provider name

- **GIVEN** search results were returned by Gemini successfully
- **WHEN** the user views result metadata below the profession heading
- **THEN** a badge displays "Gemini" (or similar provider name) alongside cache status and latency
- **AND** the badge uses a subtle secondary styling that does not compete with content

#### Scenario: Badge shows fallback chain when primary failed

- **GIVEN** search results were served by Groq after Gemini failed
- **WHEN** the user views result metadata
- **THEN** the badge displays "Fallback: Groq" to indicate the provider actually used
- **AND** this information is visible without requiring the user to inspect network requests

### Requirement: Polished Loading States

While a search is in progress, the UI MUST display animated skeleton placeholders that match the structure of expected results (category headers + resource cards). No blank space or unstyled content should appear during loading.

#### Scenario: Skeleton loaders match result structure

- **GIVEN** a user submits a search query
- **WHEN** the AI provider is processing the request
- **THEN** skeleton placeholders render in place of category sections (up to 4) and resource cards within each
- **AND** skeletons use an animated shimmer/pulse effect rather than static gray boxes

#### Scenario: Loading state clears on error or success

- **GIVEN** search results are loading for a profession query
- **WHEN** either the AI provider returns successfully or throws an error
- **THEN** skeleton placeholders are removed and replaced with actual content or an error message
- **AND** no layout shift occurs that causes elements to jump unexpectedly
