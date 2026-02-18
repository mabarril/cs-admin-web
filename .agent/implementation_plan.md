# Implementation Plan - Angular Modernization & Refactoring

This plan outlines the technical improvements for the **cs-admin-web** project, transitioning from standard RxJS patterns to modern Angular 18 features (Signals) and improving architectural separation.

## Goal
Improve the performance, maintainability, and code quality of the Angular application while maintaining feature parity.

## User Review Required
> [!NOTE]
> I will be migrating some state management from RxJS Observables to Angular Signals. This is a modern standard in Angular 18 that improves performance and reduces boilerplate in templates.

## Proposed Changes

### 1. Core Services Modernization
#### [MODIFY] [auth.service.ts](file:///wsl.localhost/Ubuntu-24.04/home/barril/workspace/cs-admin-web/src/app/core/services/auth.service.ts)
- Convert `currentUserProfileSubject` to a `signal<UserProfile | null>(null)`.
- Expose the profile as a read-only signal.
- Remove manual `currentUserProfile` getter.

#### [NEW] [profile.service.ts](file:///wsl.localhost/Ubuntu-24.04/home/barril/workspace/cs-admin-web/src/app/core/services/profile.service.ts)
- Move database operations related to `user_profiles` table from `AuthService` to this new service.
- Implement specialized methods for fetching and updating profiles.

### 2. UI & Shared Components
#### [MODIFY] [sidebar.component.ts](file:///wsl.localhost/Ubuntu-24.04/home/barril/workspace/cs-admin-web/src/app/shared/components/sidebar/sidebar.component.ts)
- Convert `visibleMenuItems` to a `computed()` signal.
- Replace emoji icons with **Lucide Angular** or **Material Icons** for a more professional look.
- Extract template to an external file if it grows larger.

#### [MODIFY] [header.component.ts](file:///wsl.localhost/Ubuntu-24.04/home/barril/workspace/cs-admin-web/src/app/shared/components/header/header.component.ts)
- Use Signals to display user name and avatar.

### 3. Error Handling
#### [NEW] [error.interceptor.ts](file:///wsl.localhost/Ubuntu-24.04/home/barril/workspace/cs-admin-web/src/app/core/interceptors/error.interceptor.ts)
- Create a centralized error interceptor to handle Supabase/API errors globally and show unified toast notifications.

---

## Verification Plan

### Automated Tests
- Run `ng build` to ensure no regression in compilation.
- Update existing tests in `auth.service.spec.ts` to work with Signals.

### Manual Verification
- Verify login flow with the new Signal-based `AuthService`.
- Verify the sidebar correctly updates its visibility based on the user's role.
- Trigger an error (e.g., wrong password) to verify the new Error Interceptor.
