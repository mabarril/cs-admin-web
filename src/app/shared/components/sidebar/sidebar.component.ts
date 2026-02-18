import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user-profile.model';

interface MenuItem {
  label: string;
  route: string;
  allowedRoles: UserRole[];
  svgPath: string;
}

const ALL_MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    allowedRoles: ['admin', 'secretary', 'treasury', 'counselor', 'board'],
    svgPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    label: 'Cadastros',
    route: '/cadastros',
    allowedRoles: ['admin', 'secretary'],
    svgPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  },
  {
    label: 'Financeiro',
    route: '/financeiro',
    allowedRoles: ['admin', 'treasury'],
    svgPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    label: 'Administrativo',
    route: '/administrativo',
    allowedRoles: ['admin', 'secretary', 'board'],
    svgPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  },
  {
    label: 'Relatórios',
    route: '/relatorios',
    allowedRoles: ['admin', 'secretary', 'treasury', 'counselor', 'board'],
    svgPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  }
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <!-- App Logo -->
      <div class="p-6 border-b border-gray-700">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1">
        @for (item of visibleMenuItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-indigo-600 text-white"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path [attr.d]="item.svgPath"/>
            </svg>
            <span class="text-sm font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {
  private authService = inject(AuthService);

  /** Computed signal: filtra os itens do menu com base no role do usuário */
  readonly visibleMenuItems = computed(() =>
    ALL_MENU_ITEMS.filter(item =>
      this.authService.hasAnyRole(item.allowedRoles)
    )
  );
}
