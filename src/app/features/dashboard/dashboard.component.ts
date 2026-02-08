import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container mx-auto px-4 py-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Sistema de Gerenciamento
        </h1>
        <h2 class="text-2xl text-gray-600 mb-8">
          Clube de Desbravadores
        </h2>
        
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div class="gradient-primary text-white rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold mb-2">🚀 Projeto Configurado!</h3>
            <p>Angular + Tailwind CSS + Supabase</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">📋 Cadastros</h4>
              <p class="text-sm text-gray-600">Unidades, Classes, Especialidades, Desbravadores</p>
            </div>
            
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">💰 Financeiro</h4>
              <p class="text-sm text-gray-600">Mensalidades, Caixa, Custos</p>
            </div>
            
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">📁 Administrativo</h4>
              <p class="text-sm text-gray-600">Patrimônio, Atas, Atos, Autorizações</p>
            </div>
            
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">📊 Relatórios</h4>
              <p class="text-sm text-gray-600">Fluxo de Caixa, Mensalidades, Patrimônio</p>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800">
              ✅ Estrutura do projeto criada com sucesso!<br>
              📝 Próximo passo: Configurar Supabase e implementar autenticação
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class DashboardComponent { }
