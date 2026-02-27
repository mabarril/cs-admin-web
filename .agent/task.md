# Tasks

- [x] Explore Angular codebase and document structure
- [x] Review core logic and components (Angular versions)
- [x] Create detailed Angular code review report
- [x] Update agent files in .agent directory for version control
- [/] Refactoring and Modernization (Angular v18 to v20)
    - [ ] Create refactoring branch `feature/angular-20-migration`
    - [ ] Execute migration from Angular 18 to 19 (`ng update @angular/core@19 @angular/cli@19`)
    - [ ] Execute migration from Angular 19 to 20 (`ng update @angular/core@20 @angular/cli@20`)
    - [ ] Refactor `AuthService`
        - [ ] Move state to Signals
        - [ ] Extract `ProfileService`
    - [ ] Refactor `SidebarComponent`
        - [ ] Migrate to `computed()` signals
        - [ ] Replace emoji icons with professional icon library
    - [ ] Implement global Error Interceptor
- [ ] Implement next module: Registry (Membros)
