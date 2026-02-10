import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user-profile.model';

interface MenuItem {
    label: string;
    icon: string;
    route: string;
    allowedRoles: UserRole[];
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <aside class="w-64 bg-gray-900 text-white min-h-screen">
      <nav class="p-4 space-y-2">
        @for (item of visibleMenuItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-indigo-600"
            class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <span class="mr-3" [innerHTML]="item.icon"></span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
    </aside>
  `,
    styles: []
})
export class SidebarComponent {
    private authService = inject(AuthService);

    private menuItems: MenuItem[] = [
        {
            label: 'Dashboard',
            icon: '📊',
            route: '/dashboard',
            allowedRoles: ['admin', 'secretary', 'treasury', 'counselor', 'board']
        },
        {
            label: 'Cadastros',
            icon: '📝',
            route: '/cadastros',
            allowedRoles: ['admin', 'secretary']
        },
        {
            label: 'Financeiro',
            icon: '💰',
            route: '/financeiro',
            allowedRoles: ['admin', 'treasury']
        },
        {
            label: 'Administrativo',
            icon: '📋',
            route: '/administrativo',
            allowedRoles: ['admin', 'secretary', 'board']
        },
        {
            label: 'Relatórios',
            icon: '📈',
            route: '/relatorios',
            allowedRoles: ['admin', 'secretary', 'treasury', 'counselor', 'board']
        }
    ];

    get visibleMenuItems(): MenuItem[] {
        return this.menuItems.filter(item =>
            this.authService.hasAnyRole(item.allowedRoles)
        );
    }
}
