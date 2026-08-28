## ADDED Requirements

### Requirement: Compelling Hero Section

Feature: Smart Otter — Landing Page

The landing page hero MUST communicate the app's value proposition clearly with action-oriented copy, visual hierarchy, and a prominent call-to-action. The headline should be specific to the AI-powered resource discovery use case rather than generic branding text.

#### Scenario: Hero headline conveys value proposition

- **GIVEN** a user lands on the homepage
- **WHEN** they view the hero section at the top of the page
- **THEN** the headline clearly states that Smart Otter helps find curated professional resources using AI
- **AND** the subheadline explains how it works in one sentence (e.g., "Enter any profession — get tools, communities, learning platforms, and documentation")

#### Scenario: Primary CTA is prominent and obvious

- **GIVEN** a user views the hero section
- **WHEN** they look for an action to take
- **THEN** a large, high-contrast button labeled "Start Searching" (or similar) is centered below the headline
- **AND** clicking it navigates to `/search` with no intermediate steps

#### Scenario: Feature highlights appear below hero

- **GIVEN** a user scrolls past the hero section on the landing page
- **WHEN** they view the feature cards or highlights area
- **THEN** at least three feature cards are displayed showing key capabilities (e.g., "AI-Powered Search", "Curated Resources", "Instant Results from Cache")
- **AND** each card has a title, brief description, and relevant icon

### Requirement: Responsive Landing Page Layout

The landing page MUST render correctly on all supported viewport sizes (mobile ≥320px, tablet ≥768px, desktop ≥1024px) with appropriate spacing, typography scaling, and layout adjustments.

#### Scenario: Landing page displays as centered single-column on mobile

- **GIVEN** a user views the landing page on a mobile device (≤640px width)
- **WHEN** the page renders
- **THEN** the hero content is vertically centered with comfortable padding
- **AND** feature cards stack in a single column

#### Scenario: Landing page uses multi-column layout on desktop

- **GIVEN** a user views the landing page on a desktop (≥1024px width)
- **WHEN** the page renders
- **THEN** the hero content is left-aligned or centered with generous horizontal spacing
- **AND** feature cards display in a responsive grid (3 columns on wide screens, 2 on medium)

### Requirement: Visual Polish and Branding Consistency

All landing page elements MUST use the project's Tailwind CSS design tokens (`--primary`, `--foreground`, etc.) so that theme switching updates all colors consistently. Typography must use Geist Sans for headings and body text with Geist Mono only for code or technical accents.

#### Scenario: Theme switch updates landing page colors

- **GIVEN** a user is on the landing page in light mode
- **WHEN** they toggle to dark mode via the header control
- **THEN** all background, text, border, and accent colors update to their dark-mode equivalents
- **AND** no element retains hardcoded hex or RGB values outside the design tokens
