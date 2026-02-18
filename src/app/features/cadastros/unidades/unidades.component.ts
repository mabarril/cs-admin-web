import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UnidadeService } from '../services/unidade.service';
import { Unidade, UnidadeForm } from '../../../core/models/cadastros.model';

@Component({
    selector: 'app-unidades',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Unidades</h2>
          <p class="text-sm text-gray-500 mt-1">Gerencie as unidades do clube</p>
        </div>
        <button
          (click)="abrirFormulario()"
          class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nova Unidade
        </button>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && unidades().length === 0) {
        <div class="text-center py-16 bg-white rounded-xl border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <p class="text-gray-500 font-medium">Nenhuma unidade cadastrada</p>
          <p class="text-gray-400 text-sm mt-1">Clique em "Nova Unidade" para começar</p>
        </div>
      }

      <!-- Table -->
      @if (!loading() && unidades().length > 0) {
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (unidade of unidades(); track unidade.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900">{{ unidade.name }}</td>
                  <td class="px-6 py-4 text-gray-500">{{ unidade.description || '—' }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        (click)="abrirFormulario(unidade)"
                        class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button
                        (click)="confirmarExclusao(unidade)"
                        class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path stroke-linecap="round" stroke-linejoin="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <!-- Modal Form -->
    @if (modalAberto()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="fecharFormulario()">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editando() ? 'Editar Unidade' : 'Nova Unidade' }}
            </h3>
            <button (click)="fecharFormulario()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="salvar()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome <span class="text-red-500">*</span></label>
              <input
                formControlName="name"
                type="text"
                placeholder="Ex: Tigres"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                [class.border-red-400]="form.get('name')?.invalid && form.get('name')?.touched"
              />
              @if (form.get('name')?.invalid && form.get('name')?.touched) {
                <p class="text-red-500 text-xs mt-1">Nome é obrigatório</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                formControlName="description"
                rows="3"
                placeholder="Descrição opcional da unidade"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            @if (erro()) {
              <p class="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{{ erro() }}</p>
            }

            <div class="flex gap-3 pt-2">
              <button
                type="button"
                (click)="fecharFormulario()"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="form.invalid || salvando()"
                class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {{ salvando() ? 'Salvando...' : (editando() ? 'Atualizar' : 'Criar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Confirm Delete Dialog -->
    @if (unidadeParaExcluir()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Excluir Unidade</h3>
              <p class="text-sm text-gray-500">Tem certeza que deseja excluir <strong>{{ unidadeParaExcluir()!.name }}</strong>?</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button (click)="unidadeParaExcluir.set(null)" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">Cancelar</button>
            <button (click)="excluir()" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">Excluir</button>
          </div>
        </div>
      </div>
    }
  `
})
export class UnidadesComponent implements OnInit {
    private service = inject(UnidadeService);
    private fb = inject(FormBuilder);

    readonly unidades = signal<Unidade[]>([]);
    readonly loading = signal(true);
    readonly modalAberto = signal(false);
    readonly salvando = signal(false);
    readonly erro = signal<string | null>(null);
    readonly editando = signal<Unidade | null>(null);
    readonly unidadeParaExcluir = signal<Unidade | null>(null);

    form = this.fb.group({
        name: ['', Validators.required],
        description: ['']
    });

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.loading.set(true);
        this.service.listar().subscribe(data => {
            this.unidades.set(data);
            this.loading.set(false);
        });
    }

    abrirFormulario(unidade?: Unidade): void {
        this.editando.set(unidade ?? null);
        this.erro.set(null);
        this.form.reset({ name: unidade?.name ?? '', description: unidade?.description ?? '' });
        this.modalAberto.set(true);
    }

    fecharFormulario(): void {
        this.modalAberto.set(false);
        this.editando.set(null);
    }

    salvar(): void {
        if (this.form.invalid) return;
        this.salvando.set(true);
        this.erro.set(null);

        const formValue = this.form.value as UnidadeForm;
        const editando = this.editando();

        const obs = editando
            ? this.service.atualizar(editando.id, formValue)
            : this.service.criar(formValue);

        obs.subscribe(result => {
            this.salvando.set(false);
            if (result) {
                this.fecharFormulario();
                this.carregar();
            } else {
                this.erro.set('Erro ao salvar. Verifique os dados e tente novamente.');
            }
        });
    }

    confirmarExclusao(unidade: Unidade): void {
        this.unidadeParaExcluir.set(unidade);
    }

    excluir(): void {
        const unidade = this.unidadeParaExcluir();
        if (!unidade) return;
        this.service.excluir(unidade.id).subscribe(ok => {
            this.unidadeParaExcluir.set(null);
            if (ok) this.carregar();
        });
    }
}
