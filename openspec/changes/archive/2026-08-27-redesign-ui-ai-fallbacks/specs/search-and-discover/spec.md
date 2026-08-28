## ADDED Requirements

### Requirement: Dark Mode Toggle

Feature: Smart Otter — Dark Mode

The system MUST allow users to toggle between light and dark themes, with the preference persisted across sessions and respecting the operating system's `prefers-color-scheme` as the initial default.

#### Scenario: User toggles theme on/off

- **GIVEN** a user visits any page of Smart Otter
- **WHEN** the user clicks the theme toggle button in the header
- **THEN** the page switches between light and dark themes immediately without reload
- **AND** the `html` element class updates to reflect the active theme (`light` or `dark`)

#### Scenario: Theme preference persists across page navigation

- **GIVEN** a user has set dark mode as their preferred theme
- **WHEN** the user navigates from the landing page to the search page
- **THEN** the dark theme is applied on every page without flicker
- **AND** the toggle button reflects the current theme state (moon icon when light, sun icon when dark)

#### Scenario: Theme defaults to system preference on first visit

- **GIVEN** a user visits Smart Otter for the first time with no saved preference
- **WHEN** the operating system is set to dark mode
- **THEN** the app loads in dark theme automatically
- **AND** when OS switches between light and dark, the app follows if no manual override exists

#### Scenario: Theme toggle survives full page reload

- **GIVEN** a user has selected dark mode via the toggle
- **WHEN** the user refreshes the browser tab
- **THEN** the dark theme is applied before any content renders (no flash of incorrect theme)
- **AND** the preference is stored in `localStorage` under key managed by the `next-themes` library (`next-theme`)

### Requirement: Smooth Theme Transitions

The system MUST animate between light and dark themes with a smooth CSS transition to avoid jarring visual jumps.

#### Scenario: Transition animates background colors

- **GIVEN** a user toggles from light mode to dark mode
- **WHEN** the theme class changes on the `html` element
- **THEN** all color properties (background, foreground, borders) transition over 200–300ms
- **AND** no intermediate flash of unstyled content occurs

### Requirement: Dark Mode Color Accessibility

All text and interactive elements in dark mode MUST meet WCAG AA contrast ratios against their backgrounds.

#### Scenario: Primary text meets contrast ratio in dark mode

- **GIVEN** the app is in dark theme
- **WHEN** a user views body text, headings, or muted descriptions
- **THEN** all text has a contrast ratio of at least 4.5:1 against its background (WCAG AA)
- **AND** large text (18pt+) meets a minimum contrast ratio of 3:1

---

## MODIFIED Requirements

### Requirement: Resource Display with Explanations

The system MUST display each resource with its name, URL, category label, and a brief explanation of why it is recommended for the searched profession. The visual presentation MUST use polished card components with smooth hover effects, provider attribution badges, and animated loading states.

Feature: Smart Otter — Search and Discover (Enhanced)

#### Scenario: User views resources with modern card design

- **GIVEN** a search result page is displayed for "DevOps Engineer"
- **WHEN** the user scrolls through each resource in every category
- **THEN** each resource appears inside a styled card with rounded corners, subtle shadow, and hover highlight
- **AND** each card shows its name as a clickable link, URL (if available), category badge, and explanation text

#### Scenario: Provider attribution is visible on results

- **GIVEN** search results are displayed after AI inference
- **WHEN** the user examines the result metadata
- **THEN** a small badge indicates which provider served the response (e.g., "Gemini", "Groq")
- **AND** if a fallback was used, the badge shows the chain (e.g., "Fallback: Groq")

#### Scenario: Loading states show animated skeletons

- **GIVEN** a user submits a search query
- **WHEN** results are being fetched from the AI provider
- **THEN** skeleton placeholder cards animate with a pulsing/shimmer effect instead of static gray boxes
- **AND** the skeleton count matches the expected number of categories (up to 4)

### Requirement: Resource Categorization

The system MUST categorize AI-discovered resources into Tools, Communities, Learning Platforms, and Documentation sections. The UI MUST present these as collapsible or tabbed sections with smooth expand/collapse animations and clear visual hierarchy.

#### Scenario: System groups AI results into correct categories

- **GIVEN** the AI service returns a list of resources for "Game Developer"
- **WHEN** the frontend receives the normalized response
- **THEN** each resource is placed into one category (Tools, Communities, Learning Platforms, Documentation)
- **AND** empty categories are not displayed to the user

#### Scenario: System displays categorized sections with animations

- **GIVEN** search results are loaded for "UI/UX Designer"
- **WHEN** the page renders the resource groups
- **THEN** each category appears as a collapsible section with its heading and corresponding resources
- **AND** expanding or collapsing a category animates smoothly over 150–200ms

---

## REMOVED Requirements

### Requirement: Hardcoded Knowledge Base Fallback

**Reason**: The hardcoded knowledge base only covers 4 professions ("frontend developer", "backend developer", "data scientist", "devops engineer") and returns stale, manually-curated results. With real Groq/Ollama fallback providers in place, the AI chain can handle any profession query — making the static fallback obsolete and inconsistent with live search behavior.

**Migration**: All queries now rely on: (1) cache hit from a previous AI inference, or (2) the active provider's response. If all providers fail and no cache exists, the user sees an error message instead of a potentially wrong hardcoded result. The `knowledge-base.ts` module and its import in `service.ts` are removed entirely.
