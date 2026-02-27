import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CaixaService } from '../services/caixa.service';
import { LancamentoCaixa, LancamentoCaixaForm, TipoLancamento, TIPO_LANCAMENTO_LABELS } from '../../../core/models/financeiro.model';

@Component({
    selector: 'app-caixa',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="p-6 space-y-6">

      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Caixa</h2>
          <p class="text-sm text-gray-500 mt-1">Controle de entradas e saídas</p>
        </div>
        <button (click)="abrirFormulario()" class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo Lançamento
        </button>
      </div>

      <!-- Cards saldo -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-green-50 border border-green-200 rounded-xl p-5">
          <p class="text-xs font-semibold text-green-600 uppercase tracking-wider">Total Entradas</p>
          <p class="text-2xl font-bold text-green-700 mt-1">{{ totalEntradas() | currency:'BRL' }}</p>
        </div>
        <div class="bg-red-50 border border-red-200 rounded-xl p-5">
          <p class="text-xs font-semibold text-red-600 uppercase tracking-wider">Total Saídas</p>
          <p class="text-2xl font-bold text-red-700 mt-1">{{ totalSaidas() | currency:'BRL' }}</p>
        </div>
        <div class="rounded-xl p-5 border" [ngClass]="saldo() >= 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-orange-50 border-orange-200'">
          <p class="text-xs font-semibold uppercase tracking-wider" [ngClass]="saldo() >= 0 ? 'text-indigo-600' : 'text-orange-600'">Saldo</p>
          <p class="text-2xl font-bold mt-1" [ngClass]="saldo() >= 0 ? 'text-indigo-700' : 'text-orange-700'">{{ saldo() | currency:'BRL' }}</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
          <select [value]="filtroTipo()" (change)="filtroTipo.set($any($event.target).value)" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Todos</option>
            <option value="income">Entradas</option>
            <option value="expense">Saídas</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Data início</label>
          <input type="date" [value]="filtroInicio()" (change)="filtroInicio.set($any($event.target).value)" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Data fim</label>
          <input type="date" [value]="filtroFim()" (change)="filtroFim.set($any($event.target).value)" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button (click)="aplicarFiltros()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">Filtrar</button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
      }

      @if (!loading() && lancamentos().length === 0) {
        <div class="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p class="text-gray-500 font-medium">Nenhum lançamento encontrado</p>
        </div>
      }

      @if (!loading() && lancamentos().length > 0) {
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (l of lancamentos(); track l.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 text-gray-600 text-xs">{{ l.transaction_date | date:'dd/MM/yyyy' }}</td>
                  <td class="px-6 py-4 font-medium text-gray-900">{{ l.description }}</td>
                  <td class="px-6 py-4 text-gray-500">{{ l.category?.name || '—' }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" [ngClass]="l.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                      {{ l.type === 'income' ? '↑' : '↓' }} {{ tipoLabel(l.type) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right font-semibold" [ngClass]="l.type === 'income' ? 'text-green-700' : 'text-red-700'">
                    {{ (l.type === 'income' ? '+' : '-') }}{{ l.amount | currency:'BRL' }}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button (click)="abrirFormulario(l)" class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button (click)="confirmarExclusao(l)" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <h3 class="text-lg font-semibold text-gray-900">{{ editando() ? 'Editar Lançamento' : 'Novo Lançamento' }}</h3>
            <button (click)="fecharFormulario()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form [formGroup]="form" (ngSubmit)="salvar()" class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo <span class="text-red-500">*</span></label>
                <select formControlName="type" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data <span class="text-red-500">*</span></label>
                <input formControlName="transaction_date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição <span class="text-red-500">*</span></label>
              <input formControlName="description" type="text" placeholder="Ex: Mensalidade de João" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor (R$) <span class="text-red-500">*</span></label>
                <input formControlName="amount" type="number" step="0.01" min="0.01" placeholder="0,00" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                <input formControlName="payment_method" type="text" placeholder="Ex: PIX" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <input formControlName="notes" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
              <h3 class="font-semibold text-gray-900">Excluir Lançamento</h3>
              <p class="text-sm text-gray-500">Tem certeza que deseja excluir <strong>{{ paraExcluir()!.description }}</strong>?</p>
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
export class CaixaComponent implements OnInit {
  private service = inject(CaixaService);
  private fb = inject(FormBuilder);

  readonly lancamentos = signal<LancamentoCaixa[]>([]);
  readonly loading = signal(true);
  readonly modalAberto = signal(false);
  readonly salvando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly editando = signal<LancamentoCaixa | null>(null);
  readonly paraExcluir = signal<LancamentoCaixa | null>(null);

  readonly filtroTipo = signal<string>('');
  readonly filtroInicio = signal('');
  readonly filtroFim = signal('');

  readonly totalEntradas = computed(() => this.lancamentos().filter(l => l.type === 'income').reduce((s, l) => s + l.amount, 0));
  readonly totalSaidas = computed(() => this.lancamentos().filter(l => l.type === 'expense').reduce((s, l) => s + l.amount, 0));
  readonly saldo = computed(() => this.totalEntradas() - this.totalSaidas());

  form = this.fb.group({
    type: ['income' as TipoLancamento, Validators.required],
    transaction_date: [new Date().toISOString().split('T')[0], Validators.required],
    description: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    payment_method: [''],
    notes: ['']
  });

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.loading.set(true);
    this.service.listar({
      tipo: (this.filtroTipo() as TipoLancamento) || undefined,
      dataInicio: this.filtroInicio() || undefined,
      dataFim: this.filtroFim() || undefined
    }).subscribe(data => {
      this.lancamentos.set(data);
      this.loading.set(false);
    });
  }

  aplicarFiltros(): void { this.carregar(); }

  abrirFormulario(l?: LancamentoCaixa): void {
    this.editando.set(l ?? null);
    this.erro.set(null);
    this.form.reset({
      type: l?.type ?? 'income',
      transaction_date: l?.transaction_date ?? new Date().toISOString().split('T')[0],
      description: l?.description ?? '',
      amount: l?.amount ?? 0,
      payment_method: l?.payment_method ?? '',
      notes: l?.notes ?? ''
    });
    this.modalAberto.set(true);
  }

  fecharFormulario(): void { this.modalAberto.set(false); this.editando.set(null); }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando.set(true);
    this.erro.set(null);
    const raw = this.form.value;
    const formValue: LancamentoCaixaForm = {
      type: raw.type as TipoLancamento,
      transaction_date: raw.transaction_date!,
      description: raw.description!,
      amount: raw.amount!,
      payment_method: raw.payment_method || undefined,
      notes: raw.notes || undefined
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

  confirmarExclusao(l: LancamentoCaixa): void { this.paraExcluir.set(l); }

  excluir(): void {
    const l = this.paraExcluir();
    if (!l) return;
    this.service.excluir(l.id).subscribe(ok => {
      this.paraExcluir.set(null);
      if (ok) this.carregar();
    });
  }

  tipoLabel(tipo: TipoLancamento): string {
    return TIPO_LANCAMENTO_LABELS[tipo] ?? tipo;
  }
}
