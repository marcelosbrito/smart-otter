# Search and Discover — Delta Spec

## ADDED Requirements

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

The system MUST render a minimal footer bar at the bottom of every page containing the Smart Otter brand name, three internal navigation links (Changelog, FAQ, Privacy), creator attribution linking to Marcelo Brito's GitHub profile, and three social/project icons (GitHub repository, X profile, LinkedIn profile). The footer must appear consistently across all pages including home, search results, favorites, sign-in, and the new supporting pages.

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

## MODIFIED Requirements

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
