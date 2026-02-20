import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ROLE_NAMES } from '../../../core/models/user-profile.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <ng-container>

          <!-- User Menu -->
          @if (userProfile()) {
            <div class="flex items-center gap-4">
              <!-- User Info -->
              <div class="text-right hidden sm:block">
                <p class="text-sm font-medium text-gray-900">{{ userProfile()!.full_name }}</p>
                <p class="text-xs text-gray-500">{{ roleName() }}</p>
              </div>

              <!-- Avatar with Dropdown -->
              <div class="relative">
                <button
                  (click)="toggleMenu()"
                  class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  [attr.aria-label]="'Menu do usuário ' + userProfile()!.full_name"
                >
                  {{ initials() }}
                </button>

                <!-- Dropdown Menu -->
                @if (showMenu()) {
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                    <div class="px-4 py-2 border-b border-gray-100 sm:hidden">
                      <p class="text-sm font-medium text-gray-900">{{ userProfile()!.full_name }}</p>
                      <p class="text-xs text-gray-500">{{ roleName() }}</p>
                    </div>
                    <a
                      routerLink="/profile"
                      class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      (click)="closeMenu()"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Meu Perfil
                    </a>
                    <button
                      (click)="logout()"
                      class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sair
                    </button>
                  </div>
                }
              </div>
            </div>
          }
    </ng-container>
  `,
  styles: []
})
export class HeaderComponent {
  private authService = inject(AuthService);

  // Signals from AuthService
  readonly userProfile = this.authService.currentUserProfile;

  // Local UI state
  readonly showMenu = signal(false);

  // Computed values
  readonly initials = computed(() => {
    const name = this.userProfile()?.full_name ?? '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  });

  readonly roleName = computed(() => {
    const role = this.userProfile()?.role;
    return role ? (ROLE_NAMES[role] ?? role) : '';
  });

  toggleMenu(): void {
    this.showMenu.update(v => !v);
  }

  closeMenu(): void {
    this.showMenu.set(false);
  }

  async logout(): Promise<void> {
    this.showMenu.set(false);
    await this.authService.signOut();
  }
}
