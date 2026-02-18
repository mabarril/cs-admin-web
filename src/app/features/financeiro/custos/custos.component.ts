import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CustoService } from '../services/custo.service';
import { Custo, CustoForm, PeriodicidadeCusto, PERIODICIDADE_LABELS } from '../../../core/models/financeiro.model';

@Component({
    selector: 'app-custos',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="p-6 space-y-6">

      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Custos</h2>
          <p class="text-sm text-gray-500 mt-1">Despesas fixas e variáveis do clube</p>
        </div>
        <button (click)="abrirFormulario()" class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo Custo
        </button>
      </div>

      <!-- Resumo mensal -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custos Mensais</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalMensal() | currency:'BRL' }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custo Anual Estimado</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalMensal() * 12 | currency:'BRL' }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total de Itens</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ custos().length }}</p>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }

      @if (!loading() && custos().length === 0) {
        <div class="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p class="text-gray-500 font-medium">Nenhum custo cadastrado</p>
        </div>
      }

      @if (!loading() && custos().length > 0) {
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Periodicidade</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mensal</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (c of custos(); track c.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <p class="font-medium text-gray-900">{{ c.nome }}</p>
                    @if (c.descricao) { <p class="text-xs text-gray-400 mt-0.5">{{ c.descricao }}</p> }
                  </td>
                  <td class="px-6 py-4 text-gray-500">{{ c.categoria || '—' }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {{ periodicidadeLabel(c.periodicidade) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right font-medium text-gray-900">{{ c.valor | currency:'BRL' }}</td>
                  <td class="px-6 py-4 text-right text-gray-500 text-xs">{{ valorMensal(c) | currency:'BRL' }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button (click)="abrirFormulario(c)" class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button (click)="confirmarExclusao(c)" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

    @if (modalAberto()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="fecharFormulario()">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">{{ editando() ? 'Editar Custo' : 'Novo Custo' }}</h3>
            <button (click)="fecharFormulario()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form [formGroup]="form" (ngSubmit)="salvar()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome <span class="text-red-500">*</span></label>
              <input formControlName="nome" type="text" placeholder="Ex: Aluguel do salão" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor (R$) <span class="text-red-500">*</span></label>
                <input formControlName="valor" type="number" step="0.01" min="0.01" placeholder="0,00" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Periodicidade <span class="text-red-500">*</span></label>
                <select formControlName="periodicidade" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                  <option value="unico">Único</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <input formControlName="categoria" type="text" placeholder="Ex: Infraestrutura" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea formControlName="descricao" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
            </div>
            @if (erro()) {
              <p class="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{{ erro() }}</p>
            }
            <div class="flex gap-3 pt-2">
              <button type="button" (click)="fecharFormulario()" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">Cancelar</button>
              <button type="submit" [disabled]="form.invalid || salvando()" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium">
                {{ salvando() ? 'Salvando...' : (editando() ? 'Atualizar' : 'Criar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (paraExcluir()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Excluir Custo</h3>
              <p class="text-sm text-gray-500">Tem certeza que deseja excluir <strong>{{ paraExcluir()!.nome }}</strong>?</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button (click)="paraExcluir.set(null)" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">Cancelar</button>
            <button (click)="excluir()" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">Excluir</button>
          </div>
        </div>
      </div>
    }
  `
})
export class CustosComponent implements OnInit {
    private service = inject(CustoService);
    private fb = inject(FormBuilder);

    readonly custos = signal<Custo[]>([]);
    readonly loading = signal(true);
    readonly modalAberto = signal(false);
    readonly salvando = signal(false);
    readonly erro = signal<string | null>(null);
    readonly editando = signal<Custo | null>(null);
    readonly paraExcluir = signal<Custo | null>(null);

    readonly totalMensal = computed(() => this.service.calcularTotalMensal(this.custos()));

    form = this.fb.group({
        nome: ['', Validators.required],
        valor: [0, [Validators.required, Validators.min(0.01)]],
        periodicidade: ['mensal' as PeriodicidadeCusto, Validators.required],
        categoria: [''],
        descricao: ['']
    });

    ngOnInit(): void { this.carregar(); }

    carregar(): void {
        this.loading.set(true);
        this.service.listar().subscribe(data => {
            this.custos.set(data);
            this.loading.set(false);
        });
    }

    abrirFormulario(c?: Custo): void {
        this.editando.set(c ?? null);
        this.erro.set(null);
        this.form.reset({
            nome: c?.nome ?? '',
            valor: c?.valor ?? 0,
            periodicidade: c?.periodicidade ?? 'mensal',
            categoria: c?.categoria ?? '',
            descricao: c?.descricao ?? ''
        });
        this.modalAberto.set(true);
    }

    fecharFormulario(): void { this.modalAberto.set(false); this.editando.set(null); }

    salvar(): void {
        if (this.form.invalid) return;
        this.salvando.set(true);
        this.erro.set(null);
        const raw = this.form.value;
        const formValue: CustoForm = {
            nome: raw.nome!,
            valor: raw.valor!,
            periodicidade: raw.periodicidade as PeriodicidadeCusto,
            categoria: raw.categoria || undefined,
            descricao: raw.descricao || undefined
        };
        const editando = this.editando();
        const obs = editando
            ? this.service.atualizar(editando.id, formValue)
            : this.service.criar(formValue);
        obs.subscribe(result => {
            this.salvando.set(false);
            if (result) { this.fecharFormulario(); this.carregar(); }
            else this.erro.set('Erro ao salvar. Tente novamente.');
        });
    }

    confirmarExclusao(c: Custo): void { this.paraExcluir.set(c); }

    excluir(): void {
        const c = this.paraExcluir();
        if (!c) return;
        this.service.excluir(c.id).subscribe(ok => {
            this.paraExcluir.set(null);
            if (ok) this.carregar();
        });
    }

    periodicidadeLabel(p: PeriodicidadeCusto): string {
        return PERIODICIDADE_LABELS[p] ?? p;
    }

    valorMensal(c: Custo): number {
        if (c.periodicidade === 'mensal') return c.valor;
        if (c.periodicidade === 'anual') return c.valor / 12;
        return 0;
    }
}
