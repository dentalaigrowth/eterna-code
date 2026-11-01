# Project memory

## Product intent & audience

- ETERNA admin login screen at `/admin`; part of an existing admin dashboard product.
- Audience: internal administrators authenticating to manage ETERNA content/settings.
- Albanian-language UI for the login screen (exact strings provided).

## Brand personality & voice

- Elegant, refined, brand-consistent (ETERNA).
- Professional admin tone; Albanian wording for login only.

## Visual design & UX direction

- Login screen aesthetic: dark olive background, warm ivory card, elegant typography, improved proportions/spacing/alignment.
- Logo text: `E T E R N A` (spaced letters).
- Refined login button; responsive mobile/desktop layout.
- Show/hide password toggle icon added.
- Input is an email field; placeholder `info@eterna-design.com`; password placeholder `Shkruani fjalëkalimin tuaj`.
- Preserve ETERNA branding and dashboard styling; no dashboard/public-site visual changes.

## Decisions, constraints & rationale

- Modify ONLY the existing admin login screen; dashboard already built and functional — do not touch it.
- Replace username input with email input while keeping existing auth backend (Supabase) and credentials unchanged.
- No database changes; no new dashboard/pages; no public website modifications.
- Login functionality must remain identical; only login screen design, wording, and email input updated.
- Implemented directly in existing project: `renderLogin` in `main.js` plus login-screen CSS section; build passes.

## Open questions & assumptions

- Assumption: existing auth backend accepts email-based input without backend changes (confirmed working).
- No explicit icon set specified for show/hide; used inline approach.
- Albanian localization scope currently limited to login screen; dashboard wording/language not addressed.