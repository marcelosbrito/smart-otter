## MODIFIED Requirements

### Requirement: Profession Name Display on Results Page

The system MUST display the searched profession as a prominent heading when search results are available. The "Results for 'X'" text is removed from the metrics paragraph; provider badge, cache status, and latency remain below the heading.

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

#### Scenario: No "Results for Profession" text appears in metrics paragraph

- **GIVEN** a user has performed a search and results have loaded
- **WHEN** the results page renders with the profession heading
- **THEN** no "Results for 'X'" text appears before the provider badge in the metrics paragraph
- **AND** the provider badge, cache status, and latency remain visible below the heading
