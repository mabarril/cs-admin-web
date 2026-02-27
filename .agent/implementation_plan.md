# Implementation Plan - Angular v20 Migration & Refactoring

This plan outlines the technical improvements for the **cs-admin-web** project, transitioning from Angular 18 standard RxJS patterns to modern Angular 20 features (Signals, new control flow, updated builders) and improving architectural separation.

## Goal
Migrate the application from **Angular 18 to Angular 20**, improving performance, maintainability, and code quality while maintaining feature parity. The process will be done in two steps: v18 -> v19, then v19 -> v20.

## User Review Required
> [!NOTE]
> The migration process will use the Angular CLI update schematics (`ng update`). There will be a multi-step update process because Angular requires migrating one major version at a time. State management and control flows will also be modernized.

## Proposed Changes

### 1. Version Migration
#### [MODIFY] [package.json](file:///wsl.localhost/Ubuntu-24.04/home/barril/workspace/cs-admin-web/package.json)
- Run `ng update @angular/core@19 @angular/cli@19` (Step 1)
- Run `ng update @angular/core@20 @angular/cli@20` (Step 2)
- Ensure RxJS, Zone.js, and TypeScript dependencies are updated alongside Angular.

### 2. Core Services Modernization
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

### 4. Error Handling
#### [NEW] [error.interceptor.ts](file:///wsl.localhost/Ubuntu-24.04/home/barril/workspace/cs-admin-web/src/app/core/interceptors/error.interceptor.ts)
- Create a centralized error interceptor to handle Supabase/API errors globally and show unified toast notifications using the new functional interceptor approach.

---

## Verification Plan

### Automated Tests
- Run `ng build` to ensure no regression in compilation.
- Update existing tests in `auth.service.spec.ts` to work with Signals.

### Manual Verification
- Verify login flow with the new Signal-based `AuthService`.
- Verify the sidebar correctly updates its visibility based on the user's role.
- Trigger an error (e.g., wrong password) to verify the new Error Interceptor.
