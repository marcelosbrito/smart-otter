## ADDED Requirements

### Requirement: User Authentication via Clerk

Feature: Smart Otter — User Authentication

#### Scenario: User signs in with email

- **GIVEN** a visitor is on the landing page without an active session
- **WHEN** the user clicks Sign In and enters valid credentials
- **THEN** the user is authenticated and redirected to the search interface
- **AND** the navigation bar shows the user's profile indicator

#### Scenario: User signs in with social login

- **GIVEN** a visitor has not yet authenticated
- **WHEN** the user selects Google or GitHub as their sign-in provider
- **THEN** the user is redirected to the OAuth flow and returned after authorization
- **AND** the system creates a new account if one does not already exist

#### Scenario: Unauthenticated users access public features

- **GIVEN** a visitor has not signed in
- **WHEN** the user searches for "Graphic Designer"
- **THEN** search results are displayed normally
- **AND** the Save Favorite button is disabled with a prompt to sign in

## MODIFIED Requirements


## REMOVED Requirements

### Requirement: None
**Reason**: N/A — this is a greenfield project with no existing behavior to remove.

**Migration**: N/A
