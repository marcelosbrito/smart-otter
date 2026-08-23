## ADDED Requirements

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

## REMOVED Requirements

### Requirement: Full-Page Developer Mode (`<DevPage />`)
**Reason**: The full-page Dev mode was a development-only artifact that exposed internal cache stats and cache-clearing to all users. The new Dev Drawer provides the same functionality in a compact, non-disruptive side panel accessible via header gear icon.

**Migration**: Replace `<DevPage />` rendering in `src/app/layout.tsx` with the new Dev Drawer component triggered by the header gear icon. Cache stats and clear-cache endpoints remain available but are now invoked from the drawer UI instead of a dedicated page.
