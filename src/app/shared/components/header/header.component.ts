import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ROLE_NAMES } from '../../../core/models/user-profile.model';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Sistema de Gerenciamento</h1>
          </div>

          <!-- User Menu -->
          @if (userProfile) {
            <div class="flex items-center space-x-4">
              <!-- User Info -->
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ userProfile.full_name }}</p>
                <p class="text-xs text-gray-500">{{ getRoleName(userProfile.role) }}</p>
              </div>

              <!-- Avatar -->
              <div class="relative">
                <button
                  (click)="toggleMenu()"
                  class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  {{ getInitials(userProfile.full_name) }}
                </button>

                <!-- Dropdown Menu -->
                @if (showMenu) {
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                    <a
                      routerLink="/profile"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      (click)="toggleMenu()"
                    >
                      Meu Perfil
                    </a>
                    <button
                      (click)="logout()"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                    >
                      Sair
                    </button>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </header>
  `,
    styles: []
})
export class HeaderComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    showMenu = false;
    userProfile = this.authService.currentUserProfile;

    constructor() {
        // Subscribe to user profile changes
        this.authService.currentUserProfile$.subscribe(profile => {
            this.userProfile = profile;
        });
    }

    toggleMenu(): void {
        this.showMenu = !this.showMenu;
    }

    getInitials(fullName: string): string {
        return fullName
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    getRoleName(role: string): string {
        return ROLE_NAMES[role as keyof typeof ROLE_NAMES] || role;
    }

    async logout(): Promise<void> {
        await this.authService.signOut();
    }
}
