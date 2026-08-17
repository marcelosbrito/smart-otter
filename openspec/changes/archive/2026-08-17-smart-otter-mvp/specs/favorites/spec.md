## ADDED Requirements

### Requirement: Save and Organize Favorites by Profession

The system MUST allow authenticated users to save, view, organize, and remove resources as favorites grouped by profession.

Feature: Smart Otter — Favorites

#### Scenario: User saves a resource as favorite

- **GIVEN** an authenticated user is viewing search results for "Cybersecurity Analyst"
- **WHEN** the user clicks the Save Favorite button on a resource card
- **THEN** the resource is added to their favorites list under the profession "Cybersecurity Analyst"
- **AND** the UI shows confirmation that the item was saved

#### Scenario: User views favorites organized by profession

- **GIVEN** an authenticated user has saved multiple resources across different professions
- **WHEN** the user navigates to the Favorites page
- **THEN** resources are grouped and displayed under each profession heading
- **AND** each entry shows the resource name, category, explanation, and a Remove button

#### Scenario: User removes a favorite

- **GIVEN** an authenticated user has "OWASP Cheat Sheet" saved under "Cybersecurity Analyst"
- **WHEN** the user clicks the Remove Favorite button on that entry
- **THEN** the resource is deleted from their favorites list
- **AND** the corresponding profession group updates to reflect the removal

#### Scenario: Unauthenticated user attempts to save favorite

- **GIVEN** a visitor has not signed in
- **WHEN** the user clicks Save Favorite on any resource card
- **THEN** the system redirects to the sign-in page
- **AND** after successful authentication, the user returns to their previous search results

## MODIFIED Requirements


## REMOVED Requirements

### Requirement: None
**Reason**: N/A — this is a greenfield project with no existing behavior to remove.

**Migration**: N/A
