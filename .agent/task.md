# Tasks

- [x] Explore Angular codebase and document structure
- [x] Review core logic and components (Angular versions)
- [x] Create detailed Angular code review report
- [x] Update agent files in .agent directory for version control
- [/] Refactoring and Modernization (Angular v18 to v20)
    - [x] Create refactoring branch `feature/angular-20-migration`
    - [x] Execute migration from Angular 18 to 19 (`ng update @angular/core@19 @angular/cli@19`)
    - [x] Execute migration from Angular 19 to 20 (`ng update @angular/core@20 @angular/cli@20`)
    - [x] Refactor `AuthService`
        - [x] Move state to Signals
        - [x] Extract `ProfileService`
    - [x] Refactor `SidebarComponent`
        - [x] Migrate to `computed()` signals
        - [x] Replace emoji icons with professional icon library
    - [x] Implement global Error Interceptor
- [ ] Implement next module: Registry (Membros)
