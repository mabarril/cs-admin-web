import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-main-layout',
    imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
    template: `
    <div class="min-h-screen bg-gray-50">

      <!-- Header with hamburger button -->
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">

            <!-- Left: Hamburger + Logo -->
            <div class="flex items-center gap-3">
              <button
                (click)="toggleSidebar()"
                class="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                [attr.aria-label]="sidebarOpen() ? 'Fechar menu' : 'Abrir menu'"
                [attr.aria-expanded]="sidebarOpen()"
              >
                @if (sidebarOpen()) {
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                }
              </button>

              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h1 class="text-lg font-bold text-gray-900 hidden sm:block">Clube de Desbravadores</h1>
              </div>
            </div>

            <!-- Right: User menu -->
            <app-header />
          </div>
        </div>
      </header>

      <!-- Body -->
      <div class="flex">

        <!-- Mobile overlay backdrop -->
        @if (sidebarOpen()) {
          <div
            class="fixed inset-0 top-16 bg-black/40 z-20 lg:hidden"
            (click)="closeSidebar()"
            aria-hidden="true"
          ></div>
        }

        <!-- Sidebar -->
        <div
          class="fixed top-16 left-0 h-[calc(100vh-4rem)] z-20 transition-transform duration-300 ease-in-out"
          [class.translate-x-0]="sidebarOpen()"
          [class.-translate-x-full]="!sidebarOpen()"
        >
          <app-sidebar (linkClicked)="closeSidebar()" />
        </div>

        <!-- Spacer to push content when sidebar is open on desktop -->
        @if (sidebarOpen()) {
          <div class="hidden lg:block w-64 flex-shrink-0"></div>
        }

        <!-- Main content -->
        <main class="flex-1 min-w-0">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
    styles: []
})
export class MainLayoutComponent {
    readonly sidebarOpen = signal(true);

    toggleSidebar(): void {
        this.sidebarOpen.update(v => !v);
    }

    closeSidebar(): void {
        // On mobile, close on link click; on desktop keep open
        if (window.innerWidth < 1024) {
            this.sidebarOpen.set(false);
        }
    }
}
