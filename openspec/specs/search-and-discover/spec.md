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

The system MUST display each resource as a polished card within a horizontal carousel, showing its name, URL, category label, and a brief explanation of why it is recommended for the searched profession.

Feature: Smart Otter — Search and Discover

#### Scenario: User views resources with recommended explanations

- **GIVEN** a search result page is displayed for "DevOps Engineer"
- **WHEN** the user scrolls horizontally through each category's carousel
- **THEN** each resource card shows its name, explanation text (truncated to fit card height), and an external link icon
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
- **AND** the active provider indicator updates in the status widget below the search box

#### Scenario: User selects Ollama GPU Local provider

- **GIVEN** an authenticated user has opened the Dev Drawer
- **WHEN** the user selects [Ollama / GPU Local] from the provider list
- **THEN** subsequent search queries route exclusively to the Ollama provider via Cloudflare Tunnel
- **AND** the status widget displays ping status for the tunnel endpoint

#### Scenario: User selects Auto/Hybrid fallback mode

- **GIVEN** an authenticated user has opened the Dev Drawer
- **WHEN** the user selects [Auto/Hybrid] from the provider list
- **THEN** search queries attempt Groq first, then fall back to Ollama if Groq fails or times out
- **AND** the status widget shows which provider handled the last request

#### Scenario: Provider selection persists across page navigation

- **GIVEN** an authenticated user has selected a specific AI provider in the Dev Drawer
- **WHEN** the user navigates to a different page within the application
- **THEN** their selected provider remains active without requiring re-selection
- **AND** all new searches use the persisted provider choice

### Requirement: Live Status Indicator Widget Below Search Box

The system MUST display a small status indicator widget below the search input showing which AI engine is currently active and its operational state.

Feature: Smart Otter — Status Indicator Widget

#### Scenario: Widget shows Groq API online

- **GIVEN** the user has selected Groq Cloud as their active provider
- **WHEN** the system validates the Groq API key configuration
- **THEN** the widget displays 🔵 Groq API (Online) below the search box
- **AND** a brief tooltip explains that results will be served by Groq

#### Scenario: Widget shows Local GPU engine active

- **GIVEN** the user has selected Ollama / GPU Local as their active provider
- **WHEN** the system pings the Cloudflare Tunnel endpoint for Ollama
- **THEN** if reachable, the widget displays 🟢 Local GPU Engine (Fallback Active)
- **AND** if unreachable, the widget displays ⚪ Local GPU Engine (Offline — switching to Groq)

#### Scenario: Widget shows Auto mode with last-used provider

- **GIVEN** the user has selected Auto/Hybrid mode and performed a search
- **WHEN** the AI service returns results using either Groq or Ollama
- **THEN** the widget updates to show which provider served the most recent result
- **AND** the indicator color reflects the actual provider used (🔵 for Groq, 🟢 for Local)

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

