import { Component, inject, computed, output } from '@angular/core';
import { LucideAngularModule, LayoutDashboard, Users, CircleDollarSign, ShieldAlert, LineChart } from 'lucide-angular';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user-profile.model';

interface MenuItem {
  label: string;
  route: string;
  allowedRoles: UserRole[];
  icon: any;
}

const ALL_MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    allowedRoles: ['admin', 'secretary', 'treasury', 'counselor', 'board'],
    icon: LayoutDashboard
  },
  {
    label: 'Cadastros',
    route: '/cadastros',
    allowedRoles: ['admin', 'secretary'],
    icon: Users
  },
  {
    label: 'Usuários',
    route: '/cadastros/usuarios',
    allowedRoles: ['admin', 'secretary', 'board'],
    icon: Users
  },
  {
    label: 'Financeiro',
    route: '/financeiro',
    allowedRoles: ['admin', 'treasury'],
    icon: CircleDollarSign
  },
  {
    label: 'Administrativo',
    route: '/administrativo',
    allowedRoles: ['admin', 'secretary', 'board'],
    icon: ShieldAlert
  },
  {
    label: 'Relatórios',
    route: '/relatorios',
    allowedRoles: ['admin', 'secretary', 'treasury', 'counselor', 'board'],
    icon: LineChart
  }
];

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="w-64 bg-gray-900 text-white h-full flex flex-col">
      <div class="px-6 py-4 border-b border-gray-700">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navegação</p>
      </div>
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        @for (item of visibleMenuItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-indigo-600 text-white"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
            (click)="linkClicked.emit()"
          >
            <lucide-icon [name]="item.icon.name" class="w-5 h-5 flex-shrink-0"></lucide-icon>
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

  /** Emitido quando um link é clicado (para fechar sidebar no mobile) */
  readonly linkClicked = output<void>();

  readonly visibleMenuItems = computed(() =>
    ALL_MENU_ITEMS.filter(item => this.authService.hasAnyRole(item.allowedRoles))
  );
}
