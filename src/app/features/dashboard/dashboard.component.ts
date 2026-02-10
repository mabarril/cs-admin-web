import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header />
      <div class="flex">
        <app-sidebar />
        <main class="flex-1 p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Stats Cards -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Desbravadores</p>
                  <p class="text-2xl font-bold text-gray-900">--</p>
                </div>
                <div class="text-4xl">👥</div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Mensalidades Pendentes</p>
                  <p class="text-2xl font-bold text-gray-900">--</p>
                </div>
                <div class="text-4xl">💰</div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Eventos</p>
                  <p class="text-2xl font-bold text-gray-900">--</p>
                </div>
                <div class="text-4xl">📅</div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Patrimônio</p>
                  <p class="text-2xl font-bold text-gray-900">--</p>
                </div>
                <div class="text-4xl">📦</div>
              </div>
            </div>
          </div>

          <!-- Welcome Message -->
          <div class="mt-8 bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Bem-vindo!</h2>
            <p class="text-gray-600">
              Sistema de Gerenciamento de Clube de Desbravadores está pronto para uso.
              Use o menu lateral para navegar entre os módulos disponíveis.
            </p>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent { }
