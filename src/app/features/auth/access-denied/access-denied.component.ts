import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-access-denied',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="max-w-md w-full text-center">
        <div class="mb-8">
          <svg class="mx-auto h-24 w-24 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 class="text-4xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
        
        <p class="text-lg text-gray-600 mb-8">
          Você não tem permissão para acessar esta página.
        </p>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p class="text-sm text-yellow-800">
            <strong>Permissões necessárias:</strong><br>
            Esta página requer permissões específicas que seu perfil não possui.
            Entre em contato com o administrador do sistema se você acredita que deveria ter acesso.
          </p>
        </div>

        <a
          routerLink="/dashboard"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao Dashboard
        </a>
      </div>
    </div>
  `,
    styles: []
})
export class AccessDeniedComponent { }
