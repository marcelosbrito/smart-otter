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

### Requirement: Sticky Header with Scroll Transparency

The system MUST make the site header fixed at the top of the viewport. At scroll position 0 the header retains its normal opaque appearance; after scrolling it transitions to a semi-transparent background with backdrop blur, subtle border, and shadow using smooth CSS transitions. The transition must not cause layout jumping or content reflow.

Feature: Smart Otter — Sticky Header

#### Scenario: Header is opaque at page top

- **GIVEN** the user loads any page
- **WHEN** the scroll position is 0 (top of page)
- **THEN** the header renders with its normal opaque background and no blur effect
- **AND** the header occupies its normal space in the document flow

#### Scenario: Header becomes translucent after scrolling

- **GIVEN** the user has scrolled down past the header's height
- **WHEN** the page continues to render
- **THEN** the header applies a semi-transparent background with backdrop blur
- **AND** the header displays a subtle border and shadow beneath it
- **AND** the transition between opaque and translucent states animates smoothly (duration ≤ 200ms)

#### Scenario: Header remains readable in both states

- **GIVEN** the user views the header at page top or after scrolling
- **WHEN** the header is in either state
- **THEN** all text, icons, and interactive elements maintain WCAG AA contrast ratios against their background
- **AND** no content becomes obscured or difficult to read

#### Scenario: Sticky header does not cause layout jumping

- **GIVEN** any page with a sticky header
- **WHEN** the user scrolls up and down continuously
- **THEN** the main content area maintains consistent vertical spacing without sudden jumps
- **AND** no elements shift position unexpectedly due to fixed header insertion

#### Scenario: Sticky header works on mobile viewports

- **GIVEN** a user opens any page on a mobile viewport (width ≤ 640px)
- **WHEN** the user scrolls the page
- **THEN** the sticky header remains visible and functional at all scroll positions
- **AND** no horizontal overflow or layout breakage occurs

### Requirement: Global Footer Component

The system MUST render a minimal footer bar at the bottom of every page containing the Smart Otter brand name, three internal navigation links (Changelog, FAQ, Privacy), creator attribution linking to Marcelo Brito's GitHub profile (`https://github.com/marcelosbrito`), and three social/project icons (GitHub repository `https://github.com/marcelosbrito/smart-otter`, X profile `https://x.com/_marcelo_brito`, LinkedIn profile `https://www.linkedin.com/in/marcelosbrito/`). All external links must open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`. The footer must appear consistently across all pages including home, search results, favorites, sign-in, and the new supporting pages.

Feature: Smart Otter — Footer

#### Scenario: Footer appears on every page

- **GIVEN** a user navigates to any route in the application
- **WHEN** the page renders
- **THEN** a footer bar is visible at the bottom of the viewport or content area
- **AND** the footer contains the same elements on every page

#### Scenario: Footer links navigate to internal pages

- **GIVEN** a user views the footer on any page
- **WHEN** the user clicks Changelog, FAQ, or Privacy in the footer
- **THEN** navigation occurs to `/changelog`, `/faq`, or `/privacy` respectively using Next.js navigation
- **AND** the new page displays with the same header and footer

#### Scenario: Creator attribution links to GitHub profile

- **GIVEN** a user views the footer
- **WHEN** the user clicks "Marcelo Brito" in the creator attribution text
- **THEN** the link opens `https://github.com/marcelosbrito` in a new browser tab
- **AND** the link has `target="_blank"` and `rel="noopener noreferrer"`

#### Scenario: Social icons are accessible

- **GIVEN** a user views the footer on any page
- **WHEN** the user inspects the GitHub, X, and LinkedIn icon links
- **THEN** each icon has an associated accessible label (aria-label or equivalent)
- **AND** each icon displays a visible hover state and receives visible focus styling when keyboard-navigated

#### Scenario: Footer stacks naturally on mobile

- **GIVEN** a user views the footer on a mobile viewport (width ≤ 640px)
- **WHEN** the page renders
- **THEN** the footer elements stack vertically without horizontal overflow
- **AND** all links and icons remain tappable with adequate touch targets

### Requirement: Changelog Page

The system MUST provide a `/changelog` page that presents the project's release history as a chronological list ordered newest first, using real evidence from OpenSpec archives, git commit history, and README. Each entry must include version identifier, date, and a concise human-readable description of meaningful milestones. The page must use existing TASA Orbiter typography, Capuccino/Aurora color palettes, shared layout with header and footer, and semantic HTML headings.

Feature: Smart Otter — Changelog Page

#### Scenario: User views changelog page title and intro

- **GIVEN** a user navigates to `/changelog`
- **WHEN** the page renders
- **THEN** an `<h1>` heading displays "Changelog" or equivalent
- **AND** a brief introductory paragraph describes what the changelog contains

#### Scenario: Changelog entries are ordered newest first

- **GIVEN** the user views the changelog page
- **WHEN** the release list renders
- **THEN** releases appear in descending chronological order (newest at top)
- **AND** each entry shows a version identifier and date

#### Scenario: Changelog contains only verifiable entries

- **GIVEN** the user reads all changelog entries
- **WHEN** they review the content
- **THEN** every feature, fix, or change mentioned can be traced to actual project evidence (git commits, OpenSpec archives, README)
- **AND** no fabricated releases, dates, or features appear

#### Scenario: Changelog page shares application layout

- **GIVEN** a user loads `/changelog`
- **WHEN** the page renders
- **THEN** it includes the sticky header and global footer consistent with all other pages
- **AND** it uses TASA Orbiter typography and existing color palettes

### Requirement: FAQ Page with Accordion

The system MUST provide an `/faq` page containing a set of frequently asked questions about Smart Otter presented in a collapsible accordion structure. Questions must cover the product purpose, AI resource generation, caching behavior, multi-provider strategy, Developer Mode, accuracy disclaimer, and current feature limitations. The accordion must use semantic HTML (`<button>` elements), appropriate ARIA attributes for collapsible sections, keyboard accessibility (Enter/Space to toggle, Escape to close), and visible focus states.

Feature: Smart Otter — FAQ Page

#### Scenario: User views FAQ page with questions

- **GIVEN** a user navigates to `/faq`
- **WHEN** the page renders
- **THEN** multiple FAQ questions are displayed in a vertically stacked list
- **AND** each question is presented as an expandable accordion item

#### Scenario: Accordion items toggle open and closed

- **GIVEN** a user views the FAQ page with collapsed accordion items
- **WHEN** the user clicks or activates (Enter/Space) a question button
- **THEN** the corresponding answer section expands to reveal its content
- **AND** previously open items collapse when another item is opened (single-open behavior)

#### Scenario: Accordion is keyboard accessible

- **GIVEN** a user navigates the FAQ page with a keyboard
- **WHEN** focus reaches an accordion question button
- **THEN** the button receives visible focus styling
- **AND** pressing Enter or Space toggles the answer open/closed
- **AND** pressing Escape closes an open item

#### Scenario: FAQ answers cover actual product features only

- **GIVEN** a user reads all FAQ answers on `/faq`
- **WHEN** they review the content
- **THEN** every question and answer relates to features that actually exist in Smart Otter (search, caching, providers, favorites, Developer Mode)
- **AND** no answers describe features that have not been implemented

#### Scenario: FAQ page shares application layout

- **GIVEN** a user loads `/faq`
- **WHEN** the page renders
- **THEN** it includes the sticky header and global footer consistent with all other pages
- **AND** it uses TASA Orbiter typography and existing color palettes

### Requirement: Privacy Page

The system MUST provide a `/privacy` page that accurately describes what user information Smart Otter collects or processes, based on actual implementation evidence. The page must cover authentication data (handled by Clerk), favorite resources (stored in Supabase), search requests and cached results (stored in Supabase knowledge_cache table), AI provider requests (sent to third-party APIs per user configuration), and the absence of analytics tracking. The page must use existing TASA Orbiter typography, Capuccino/Aurora color palettes, shared layout with header and footer, and semantic HTML headings.

Feature: Smart Otter — Privacy Page

#### Scenario: User views privacy page content

- **GIVEN** a user navigates to `/privacy`
- **WHEN** the page renders
- **THEN** an `<h1>` heading displays "Privacy Policy" or equivalent
- **AND** sections describe authentication handling, favorites storage, search caching, AI provider usage, and analytics status

#### Scenario: Privacy page accurately reflects implementation

- **GIVEN** a user reads the privacy page content
- **WHEN** they review each section
- **THEN** every claim about data collection matches what the actual codebase implements (Clerk auth, Supabase favorites/cache, Groq/Ollama API calls with user-configured keys)
- **AND** no fabricated data collection practices are described

#### Scenario: Privacy page shares application layout

- **GIVEN** a user loads `/privacy`
- **WHEN** the page renders
- **THEN** it includes the sticky header and global footer consistent with all other pages
- **AND** it uses TASA Orbiter typography and existing color palettes

### Requirement: Header Layout and Controls

The system MUST organize header controls so that the dark mode theme toggle sits between the dev gear icon and the user avatar in the right-side controls area. The logo must include an otter face icon to its left, and clicking the logo navigates home. **MODIFIED**: The header MUST now be fixed at the top of the viewport with scroll-triggered translucent background effect as described above.

Feature: Smart Otter — Header Navigation

#### Scenario: Theme toggle appears in right header controls (unchanged)

- **GIVEN** any page is loaded
- **WHEN** the user views the header's right-side controls (dev gear, theme toggle, user avatar)
- **THEN** the dark mode toggle button is positioned between the dev gear icon and the user avatar area
- **AND** the left nav contains only the logo+icon link and the Search link

#### Scenario: Header layout remains consistent across pages (modified)

- **GIVEN** the user navigates to any page (home, search, favorites, sign-in, changelog, faq, privacy)
- **WHEN** the header renders
- **THEN** the left section always shows [otter icon + "Smart Otter" text] followed by a Search link
- **AND** the right section always shows [dev gear (if dev mode)] → [theme toggle] → [user avatar / sign-in button]
- **AND** the header is fixed at the top of the viewport with scroll-triggered translucent background

#### Scenario: Logo click navigates to home (unchanged)

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

