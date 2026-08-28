# Search and Discover

## Purpose

Allow users to search for any profession or technical domain and receive curated resource recommendations powered by AI with cache-first retrieval, provider selection via Dev Drawer, and live status indicators.
## Requirements
### Requirement: Search Profession or Domain

The system MUST allow users to search for any profession or technical domain and receive curated resource recommendations from the AI service layer with cache-first retrieval.

Feature: Smart Otter — Search and Discover

#### Scenario: User searches for a profession that has no cached results

- **GIVEN** a user enters "Frontend Developer" into the search field
- **WHEN** the system queries the AI service layer with the search query
- **THEN** the response includes categorized resources (Tools, Communities, Learning Platforms, Documentation)
- **AND** each resource has a brief explanation describing why it is recommended

#### Scenario: User searches for a profession that exists in cache

- **GIVEN** "Data Scientist" was previously searched and cached by another user
- **WHEN** the current user searches for "Data Scientist"
- **THEN** the system returns results instantly from cache without calling the AI provider
- **AND** the response format matches fresh queries with all categories and explanations

#### Scenario: User searches for an empty or invalid query

- **GIVEN** a user is on the search page
- **WHEN** the user submits an empty search query
- **THEN** the system displays a validation message asking for a profession or domain name

### Requirement: Resource Display with Explanations

The system MUST display each resource as a polished card within a horizontal carousel, showing its name, URL, category label, and an explanation of why it is recommended for the searched profession. Explanation text must be visible across at least 4 lines to improve readability.

Feature: Smart Otter — Search and Discover

#### Scenario: User views resources with expanded explanations

- **GIVEN** a search result page is displayed for "Cybersecurity Analyst"
- **WHEN** the user scrolls horizontally through each category's carousel
- **THEN** each resource card shows its name, explanation text (visible across at least 4 lines), and an external link icon
- **AND** clicking the card or link opens the resource URL in a new tab with `target="_blank"` and `rel="noopener noreferrer"`

#### Scenario: User navigates carousel to view all resources in a category

- **GIVEN** a category contains more resources than fit on screen (e.g., Tools has 8 items)
- **WHEN** the user clicks the right navigation arrow or swipes horizontally
- **THEN** additional resource cards scroll into view within that category's carousel only
- **AND** the left/right arrows update their disabled state based on scroll position

#### Scenario: User saves a favorite from any carousel card

- **GIVEN** a search result page is displayed with multiple categories
- **WHEN** the user clicks the favorite button on a resource card in any category
- **THEN** the resource is saved using the existing `handleSaveFavorite` function and `savedFavorites` state
- **AND** the favorite icon updates to show the saved state without reloading the page

#### Scenario: Resource card skeleton matches expanded height during loading

- **GIVEN** a user initiates a search on the results page
- **WHEN** skeleton placeholders are rendered while data loads
- **THEN** each skeleton card has sufficient height to accommodate 4 lines of explanation text (approximately `h-[260px]`)
- **AND** once real content loads, cards maintain consistent dimensions with their skeletons

### Requirement: Dev Drawer Provider Selection Panel

The system MUST replace the full-page `<DevPage />` with a gear icon in the header that opens a compact side panel/popover allowing authenticated users to select their active AI provider.

Feature: Smart Otter — Dev Drawer Provider Toggle

#### Scenario: User opens the Dev Drawer from the header

- **GIVEN** an authenticated user is on any page
- **WHEN** the user clicks the gear icon next to their logged-in user avatar in the header
- **THEN** a compact side panel slides open from the right
- **AND** the panel shows available AI providers as selectable options

#### Scenario: User selects Groq Cloud provider

- **GIVEN** an authenticated user has opened the Dev Drawer
- **WHEN** the user selects [Groq Cloud] from the provider list
- **THEN** subsequent search queries route exclusively to the Groq provider
- **AND** the active provider indicator updates in the status section inside the dev drawer

#### Scenario: User selects Ollama GPU Local provider

- **GIVEN** an authenticated user has opened the Dev Drawer
- **WHEN** the user selects [Ollama / GPU Local] from the provider list
- **THEN** subsequent search queries route exclusively to the Ollama provider via Cloudflare Tunnel
- **AND** the status section inside the dev drawer displays ping status for the tunnel endpoint

#### Scenario: User selects Auto/Hybrid fallback mode

- **GIVEN** an authenticated user has opened the Dev Drawer
- **WHEN** the user selects [Auto/Hybrid] from the provider list
- **THEN** search queries attempt Groq first, then fall back to Ollama if Groq fails or times out
- **AND** the status section inside the dev drawer shows which provider handled the last request

#### Scenario: Provider selection persists across page navigation

- **GIVEN** an authenticated user has selected a specific AI provider in the Dev Drawer
- **WHEN** the user navigates to a different page within the application
- **THEN** their selected provider remains active without requiring re-selection
- **AND** all new searches use the persisted provider choice

### Requirement: Live Status Indicator Widget Inside Dev Drawer

The system MUST display a small status indicator widget showing which AI engine is currently active and its operational state. The widget is now located inside the Dev Drawer side panel instead of below the search box on the search page.

Feature: Smart Otter — Status Indicator Widget

#### Scenario: Widget shows Groq API online in dev drawer

- **GIVEN** an authenticated user has selected Groq Cloud as their active provider
- **WHEN** the user opens the Dev Drawer from the header gear icon
- **THEN** a compact status section inside the panel displays 🔵 Groq API (Online)
- **AND** a brief tooltip explains that results will be served by Groq

#### Scenario: Widget shows Local GPU engine active in dev drawer

- **GIVEN** an authenticated user has selected Ollama / GPU Local as their active provider
- **WHEN** the user opens the Dev Drawer from the header gear icon
- **THEN** a compact status section inside the panel displays 🟢 Local GPU Engine (Fallback Active) if reachable, or ⚪ Local GPU Engine (Offline — switching to Groq) if not
- **AND** the status reflects the current provider connectivity state

#### Scenario: Status widget is absent from search page below input

- **GIVEN** a user navigates to the search results page
- **WHEN** the page renders with or without search results
- **THEN** no standalone status indicator widget appears below the search input field
- **AND** the space previously occupied by the widget is empty (no layout shift)

### Requirement: Profession Name Display on Results Page

The system MUST display the searched profession as a prominent heading when search results are available.

Feature: Smart Otter — Search and Discover

#### Scenario: Profession name appears as heading above carousels

- **GIVEN** a user has performed a search and results have loaded
- **WHEN** the results page renders with non-empty categories
- **THEN** an `<h2>` heading displays the profession name in title case (e.g., "Game Developer") directly above the first category carousel
- **AND** the heading uses `text-xl font-semibold` styling

#### Scenario: Profession heading is not shown when no results exist

- **GIVEN** a user has performed a search that returns empty categories
- **WHEN** the results page renders with zero resources across all categories
- **THEN** no profession name heading is displayed
- **AND** the "no specific resources found" message is shown instead

### Requirement: Otter Icon in Header Logo

The system MUST display a minimalistic square-format otter face SVG icon to the left of the "Smart Otter" text in the header.

Feature: Smart Otter — Branding

#### Scenario: Otter icon appears next to logo text

- **GIVEN** any page is loaded
- **WHEN** the user views the header
- **THEN** a square-format otter face SVG icon is visible immediately before the "Smart Otter" text
- **AND** the combined icon+text area is wrapped in a link element pointing to `/`

#### Scenario: Clicking logo navigates home

- **GIVEN** an authenticated or unauthenticated user is on any page
- **WHEN** the user clicks either the otter icon or "Smart Otter" text in the header
- **THEN** the browser navigates to the home page (`/`)

### Requirement: Theme Color Palettes — Capuccino (Light) and Aurora Borealis (Dark)

The system MUST use custom color palettes for light and dark modes instead of default shadcn neutral tones.

Feature: Smart Otter — Theming

#### Scenario: Light mode uses Capuccino palette

- **GIVEN** the user is in light mode
- **WHEN** the application renders any page
- **THEN** background colors use Linen (`#f5f1ea`), card surfaces use white (`#ffffff`) or Khaki variants, primary text uses Espresso (`#4a342a`), accent elements use Camel (`#82967d`) or Cocoa (`#7d5a44`)
- **AND** all color combinations maintain WCAG AA contrast ratios for body text and headings

#### Scenario: Dark mode uses Aurora Borealis palette

- **GIVEN** the user is in dark mode
- **WHEN** the application renders any page
- **THEN** background colors use `#061826`, card surfaces use `#0B2C3C`, primary text and highlights use `#D9FBFF` with accent elements using teal (`#1a4f6b`) for readable selection states
- **AND** all color combinations maintain WCAG AA contrast ratios for body text and headings

#### Scenario: Theme toggle switches palettes instantly

- **GIVEN** the user is viewing any page in either light or dark mode
- **WHEN** the user activates the theme toggle
- **THEN** the entire application transitions to the opposite palette within 200ms
- **AND** the transition preserves layout structure without content shift

### Requirement: Header Layout and Controls

The system MUST organize header controls so that the dark mode theme toggle sits between the dev gear icon and the user avatar in the right-side controls area. The logo must include an otter face icon to its left, and clicking the logo navigates home.

Feature: Smart Otter — Header Navigation

#### Scenario: Theme toggle appears in right header controls

- **GIVEN** any page is loaded
- **WHEN** the user views the header's right-side controls (dev gear, theme toggle, user avatar)
- **THEN** the dark mode toggle button is positioned between the dev gear icon and the user avatar area
- **AND** the left nav contains only the logo+icon link and the Search link

#### Scenario: Header layout remains consistent across pages

- **GIVEN** the user navigates to any page (home, search, favorites, sign-in)
- **WHEN** the header renders
- **THEN** the left section always shows [otter icon + "Smart Otter" text] followed by a Search link
- **AND** the right section always shows [dev gear (if dev mode)] → [theme toggle] → [user avatar / sign-in button]

#### Scenario: Logo click navigates to home

- **GIVEN** an authenticated or unauthenticated user is on any page
- **WHEN** the user clicks the "Smart Otter" text or otter icon in the header
- **THEN** the browser navigates to `/` (home page)
- **AND** if already on the home page, the navigation reloads the home content

### Requirement: Horizontal Carousel Resource Display

The system MUST display each category of resources as an independent horizontal carousel with navigation controls, polished cards, and responsive layout.

Feature: Smart Otter — Search and Discover

#### Scenario: User views tools category as a horizontal carousel

- **GIVEN** a search result page is displayed for "Frontend Developer"
- **WHEN** the user looks at the Tools section
- **THEN** resources are presented as horizontally scrollable cards with left/right navigation arrows
- **AND** each card shows the resource name, explanation text (truncated if long), and an external link icon

#### Scenario: User navigates carousel controls independently per category

- **GIVEN** a search result page displays all four categories (Tools, Communities, Learning Platforms, Documentation)
- **WHEN** the user clicks the right arrow on the Tools carousel only
- **THEN** only the Tools section scrolls; other carousels remain stationary
- **AND** each category has its own independent scroll reference

#### Scenario: Carousel navigation controls show disabled state when at boundary

- **GIVEN** a carousel is scrolled to the far left position
- **WHEN** the user views the left navigation arrow
- **THEN** the left arrow is visually disabled and not interactive
- **AND** the right arrow remains active if more cards are available

#### Scenario: Carousel displays correctly on mobile with swipe support

- **GIVEN** a user opens the search results page on a mobile device (viewport ≤ 640px)
- **WHEN** the user swipes horizontally on any category carousel
- **THEN** the carousel scrolls smoothly to reveal additional cards
- **AND** navigation arrows remain visible and functional

#### Scenario: Carousel displays multiple cards simultaneously on desktop

- **GIVEN** a user opens the search results page on a desktop viewport (width > 1024px)
- **WHEN** the user views any category carousel
- **THEN** multiple resource cards are visible side by side within the scrollable area
- **AND** horizontal overflow is contained within each carousel, not the entire page

#### Scenario: Carousel navigation is keyboard accessible

- **GIVEN** a user is navigating with a keyboard on the search results page
- **WHEN** focus reaches a carousel navigation arrow button
- **THEN** the button receives visible focus styling and can be activated with Enter or Space
- **AND** arrow keys move focus between interactive elements in logical order

#### Scenario: Category with no results is omitted from display

- **GIVEN** a search returns resources only for Tools and Communities categories
- **WHEN** the user views the results page
- **THEN** Learning Platforms and Documentation sections are not rendered
- **AND** the remaining categories display their carousels normally

#### Scenario: Resource card shows favorite action button

- **GIVEN** a resource card is displayed within any carousel
- **WHEN** the user hovers over or focuses on the card
- **THEN** a favorite/heart icon button is visible on the card
- **AND** clicking it saves the resource using the existing favorites system without page reload

### Requirement: TASA Orbiter Typography Application

The system MUST apply TASA Orbiter as the primary typeface across all UI elements including headings, body text, buttons, navigation, labels, and metadata.

Feature: Smart Otter — Search and Discover

#### Scenario: Page headings use TASA Orbiter font

- **GIVEN** a user loads any page in the application
- **WHEN** the user views page headings (e.g., search title, category titles)
- **THEN** the text is rendered using the TASA Orbiter typeface
- **AND** the font weight matches the intended hierarchy level

#### Scenario: Resource card text uses TASA Orbiter font

- **GIVEN** a resource card is displayed within any carousel
- **WHEN** the user views the resource name, explanation, and metadata
- **THEN** all text on the card is rendered using TASA Orbiter
- **AND** the font maintains proper contrast ratios for readability

#### Scenario: Button and navigation elements use TASA Orbiter font

- **GIVEN** a user interacts with any interactive element (buttons, links, carousel arrows)
- **WHEN** the user views the text on those elements
- **THEN** all text is rendered using TASA Orbiter
- **AND** hover and focus states remain visually distinct

