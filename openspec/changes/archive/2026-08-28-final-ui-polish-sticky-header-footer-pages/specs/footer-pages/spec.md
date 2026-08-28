# Footer Pages

## ADDED Requirements

### Requirement: Global Footer Component

The system MUST render a minimal footer bar at the bottom of every page containing the Smart Otter brand name, three internal navigation links (Changelog, FAQ, Privacy), creator attribution linking to Marcelo Brito's GitHub profile (`https://github.com/marcelosbrito`), and three social/project icons (GitHub repository `https://github.com/marcelosbrito/smart-otter`, X profile `https://x.com/_marcelo_brito`, LinkedIn profile `https://www.linkedin.com/in/marcelosbrito/`). All external links must open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`. The footer must appear consistently across all pages including home, search results, favorites, sign-in, and the new supporting pages.

Feature: Smart Otter — Footer Component

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

#### Scenario: Footer does not include unnecessary content

- **GIVEN** a user views the footer on any page
- **WHEN** they inspect its contents
- **THEN** no newsletter forms, large navigation menus, descriptions, social-media feeds, or marketing sections appear
- **AND** the footer remains visually lightweight and restrained

### Requirement: Changelog Page

The system MUST provide a `/changelog` page that presents the project's release history as a chronological list ordered newest first. Each entry must include version identifier, date, and a concise human-readable description of meaningful milestones grouped by release. The content must be derived from actual project evidence (git commit history, OpenSpec archives, README). The page must use existing TASA Orbiter typography, Capuccino/Aurora color palettes, shared layout with header and footer, semantic HTML headings, and a centered content width.

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

The system MUST provide an `/faq` page containing a set of frequently asked questions about Smart Otter presented in a collapsible accordion structure. Questions must cover the product purpose, AI resource generation, caching behavior, multi-provider strategy, Developer Mode, accuracy disclaimer, and current feature limitations. The accordion must use semantic HTML (`<button>` elements for toggles), appropriate ARIA attributes (`aria-expanded`, `aria-controls`), keyboard accessibility (Enter/Space to toggle, Escape to close), and visible focus states. Only questions about features that actually exist in Smart Otter should be included.

Feature: Smart Otter — FAQ Page

#### Scenario: User views FAQ page with questions

- **GIVEN** a user navigates to `/faq`
- **WHEN** the page renders
- **THEN** multiple FAQ questions are displayed in a vertically stacked list
- **AND** each question is presented as an expandable accordion item using semantic button elements

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

The system MUST provide a `/privacy` page that accurately describes what user information Smart Otter collects or processes, based on actual implementation evidence. The page must cover authentication data (handled by Clerk), favorite resources (stored in Supabase PostgreSQL), search requests and cached results (stored in Supabase knowledge_cache table with 24h TTL), AI provider requests (sent to Groq Cloud or Ollama per user configuration), and the absence of analytics tracking or third-party cookies. The page must use existing TASA Orbiter typography, Capuccino/Aurora color palettes, shared layout with header and footer, semantic HTML headings, and a centered content width.

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
