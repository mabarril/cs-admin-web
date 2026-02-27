import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-administrativo-shell',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <div class="module-shell">
      <!-- Sub-navegação por abas -->
      <nav class="sub-nav">
        <a routerLink="patrimonio" routerLinkActive="active" class="sub-nav-tab">
          <span class="tab-icon">🏛️</span> Patrimônio
        </a>
        <a routerLink="atas" routerLinkActive="active" class="sub-nav-tab">
          <span class="tab-icon">📋</span> Atas
        </a>
        <a routerLink="atos" routerLinkActive="active" class="sub-nav-tab">
          <span class="tab-icon">📜</span> Atos
        </a>
        <a routerLink="autorizacoes" routerLinkActive="active" class="sub-nav-tab">
          <span class="tab-icon">✅</span> Autorizações
        </a>
      </nav>

      <!-- Conteúdo da rota filha -->
      <div class="module-content">
        <router-outlet />
      </div>
    </div>
  `,
    styles: [`
    .module-shell { display: flex; flex-direction: column; height: 100%; }

    .sub-nav {
      display: flex;
      gap: 0.25rem;
      padding: 0.75rem 2rem 0;
      background: var(--surface, #fff);
      border-bottom: 2px solid var(--border, #e2e8f0);
      overflow-x: auto;
      flex-shrink: 0;
    }

    .sub-nav-tab {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1.1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary, #64748b);
      border-radius: 8px 8px 0 0;
      border: 1px solid transparent;
      border-bottom: none;
      text-decoration: none;
      white-space: nowrap;
      transition: color .15s, background .15s;
      margin-bottom: -2px;
    }

    .sub-nav-tab:hover {
      color: var(--primary, #6366f1);
      background: var(--surface-2, #f8fafc);
    }

    .sub-nav-tab.active {
      color: var(--primary, #6366f1);
      background: var(--surface, #fff);
      border-color: var(--border, #e2e8f0);
      border-bottom-color: var(--surface, #fff);
      font-weight: 600;
    }

    .tab-icon { font-size: 1rem; }

    .module-content { flex: 1; overflow-y: auto; }
  `]
})
export class AdministrativoShellComponent { }
