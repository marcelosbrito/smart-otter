# Favorites

**Purpose:** Allow authenticated users to save, view, organize, and remove resources as favorites grouped by profession using PostgreSQL persistence via Supabase.

## Requirements

### Requirement: Save and Organize Favorites by Profession

The system MUST allow authenticated users to save, view, organize, and remove resources as favorites grouped by profession, persisted in the Supabase `favorites` table.

Feature: Smart Otter — Favorites

#### Scenario: User saves a resource as favorite

- **GIVEN** an authenticated user is viewing search results for "Cybersecurity Analyst"
- **WHEN** the user clicks the Save Favorite button on a resource card
- **THEN** the resource is added to their favorites list under the profession "Cybersecurity Analyst" in PostgreSQL
- **AND** the UI shows confirmation that the item was saved

#### Scenario: User views favorites organized by profession

- **GIVEN** an authenticated user has saved multiple resources across different professions
- **WHEN** the user navigates to the Favorites page
- **THEN** resources are grouped and displayed under each profession heading from PostgreSQL
- **AND** each entry shows the resource name, category, explanation, and a Remove button

#### Scenario: User removes a favorite

- **GIVEN** an authenticated user has "OWASP Cheat Sheet" saved under "Cybersecurity Analyst" in PostgreSQL
- **WHEN** the user clicks the Remove Favorite button on that entry
- **THEN** the resource is deleted from their favorites list in PostgreSQL
- **AND** the corresponding profession group updates to reflect the removal

#### Scenario: Unauthenticated user attempts to save favorite

- **GIVEN** a visitor has not signed in
- **WHEN** the user clicks Save Favorite on any resource card
- **THEN** the system redirects to the sign-in page
- **AND** after successful authentication, the user returns to their previous search results

### Requirement: Durable User and Favorite Storage via Supabase

The system MUST persist authenticated users and their favorites to a PostgreSQL database (Supabase Free tier) instead of in-memory SQLite, enabling multi-session durability across server restarts.

Feature: Smart Otter — Supabase Database

#### Scenario: System persists a user's favorite to PostgreSQL

- **GIVEN** an authenticated user clicks Save Favorite on a resource card
- **WHEN** the favorites save API route receives the request with the user's Clerk ID and resource data
- **THEN** the favorite is inserted into the Supabase `favorites` table
- **AND** the response confirms success to the client

#### Scenario: System retrieves favorites from PostgreSQL on page load

- **GIVEN** an authenticated user navigates to the Favorites page
- **WHEN** the favorites data fetches from the backend
- **THEN** resources are grouped by profession and displayed correctly
- **AND** each entry shows name, category, explanation, and a Remove button

#### Scenario: System removes a favorite from PostgreSQL

- **GIVEN** an authenticated user is viewing their favorites list
- **WHEN** the user clicks Remove on a saved resource
- **THEN** the record is deleted from the Supabase `favorites` table
- **AND** the UI updates immediately to reflect the removal

#### Scenario: System persists user registration via Clerk sync

- **GIVEN** a new user signs in for the first time via Clerk
- **WHEN** the system detects the user does not exist in PostgreSQL
- **THEN** a `users` record is created with their Clerk ID and email
- **AND** subsequent requests use the persisted user identity
