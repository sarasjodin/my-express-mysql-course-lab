# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

- Placeholder for upcoming changes and planned features

---

## [4.0.0] - 2025-07-07

### Added

- Flash message support using `express-session`, `express-flash`, and `connect-flash` for improved user feedback (error/success).
- New dedicated About page to describe the app’s purpose and technical details.

### Changed

- Updated the main color scheme to a blue-based palette and changed the app logo.
- Improved responsiveness and accessibility, including buttons, layout spacing, and cursor feedback.

### Removed

- Removed `workflows/codeql.yml` as static analysis was unnecessary for this project's scope.

---

## [3.0.0] - 2025-07-04

### Added

- Full CRUD support for courses (Create, Read, Update, Delete)
- Cancel button in form view for easier editing flow
- Footer with GitHub link and educational context
- Basic responsive styling for form and table layouts
- Server-side validation of course form input using validator (max lengths, URL must be HTTPS)

### Changed

- Improved layout and structure of `form.ejs` and `index.ejs` pages
- Navigation bar highlights current active page

### Fixed

- Issues with POST routes not parsing form data correctly
- Rendering issues in mobile view

---

## [2.1.0] - 2025-07-04

### Added

- Header partial with dynamic "active" link styling
- Static CSS integration via `public/css/style.css`
- Page layout structure with includes

---

## [2.0.0] - 2025-07-04

### Added

- feat(db): add initial MySQL connection and initialization script
- Added `db.js` with connection pool setup using `mysql2`
- Created `init-mysql.js` to initialize the `courses` table

### Changed

- Environment variables are now required for database configuration
- Added `.env.local` handling for local development

### BREAKING CHANGES

- The app now requires a valid `.env.local` file with DB credentials
- Deployment environments must define `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

---

## [1.0.3] – 2025-07-02

### Changed

- `README.md`
  Updated with a readme-template for the actual project / app to include when ready.

---

## [1.0.2] – 2025-07-02

### Changed

- `.github/workflows/codeql.yml`
  For the standard repo template all stacks have been commented out.

---

## [1.0.1] – 2025-07-02

### Changed

- `.github/workflows/codeql.yml` should only include actual stack,
  otherwise an email "Run failed: CodeQL..." will be sent to repo owner.
  For the standard repo template JS will be default stack.
- `README.md` & `.github/workflows/codeql.yml` updated according to changes

---

## [1.0.0] – 2025-07-02

### Added

- Initial template structure for public portfolio or school projects
- `README.md` with usage instructions and recommended security settings
- `.github/workflows/codeql.yml` for CodeQL code scanning
- `.github/dependabot.yml` for automated dependency alerts
- `.github/SECURITY.md` for private vulnerability reporting
- `LICENSE` file using the MIT License
- `CHANGELOG.md` for tracking notable changes

### Notes

- `.gitignore` are intentionally left out of the base template.
  Add them in your project setup phase based on your stack (e.g. Node.js, Vite, etc).

---

## Legend

- **Added**: new features or components
- **Changed**: updates to existing behavior
- **Deprecated**: soon-to-be removed features
- **Removed**: deprecated features now gone
- **Fixed**: bug fixes
- **Security**: security-related fixes or enhancements
- **Notes**: related comments, limitations, or clarifications
