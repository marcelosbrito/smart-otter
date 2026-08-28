# Search and Discover

## Purpose

Allow users to search for any profession or technical domain and receive curated resource recommendations powered by AI with cache-first retrieval, provider selection via Dev Drawer, and live status indicators — now with improved card readability, profession name display, and reorganized header controls.

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Live Status Indicator Widget Below Search Box (old location)

**Reason**: The status indicator has been relocated into the Dev Drawer side panel for better grouping of developer-facing controls. Keeping it below the search box created visual clutter and disconnected it from provider selection.

**Migration**: The `SearchStatusWidget` component is no longer imported or rendered in `src/app/search/page.tsx`. Its rendering logic is moved into a new section inside `DevDrawer.tsx`. No API changes — the widget reads the same environment variables and localStorage key.
