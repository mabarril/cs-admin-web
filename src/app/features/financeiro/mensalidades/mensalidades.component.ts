import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MensalidadeService } from '../services/mensalidade.service';
import { DesbravadorService } from '../../cadastros/services/desbravador.service';
import {
  Mensalidade, MensalidadeForm, StatusMensalidade,
  MESES, STATUS_MENSALIDADE_LABELS, STATUS_MENSALIDADE_CLASS,
  toReferenceMonth, fromReferenceMonth
} from '../../../core/models/financeiro.model';
import { Desbravador } from '../../../core/models/cadastros.model';

@Component({
    selector: 'app-mensalidades',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="p-6 space-y-6">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Mensalidades</h2>
          <p class="text-sm text-gray-500 mt-1">Controle de pagamentos mensais</p>
        </div>
        <button (click)="abrirFormulario()" class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo Lançamento
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Mês</label>
          <select [value]="filtroMes()" (change)="filtroMes.set(+($any($event.target).value))" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="0">Todos</option>
            @for (m of meses; track m.value) {
              <option [value]="m.value">{{ m.label }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Ano</label>
          <select [value]="filtroAno()" (change)="filtroAno.set(+($any($event.target).value))" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            @for (a of anos; track a) {
              <option [value]="a">{{ a }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select [value]="filtroStatus()" (change)="filtroStatus.set($any($event.target).value)" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Todos</option>
            <option value="pending">Pendente</option>
            <option value="paid">Pago</option>
            <option value="overdue">Atrasado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <button (click)="aplicarFiltros()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          Filtrar
        </button>
      </div>

      <!-- Resumo -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p class="text-xs font-medium text-green-600 uppercase tracking-wider">Pagos</p>
          <p class="text-2xl font-bold text-green-700 mt-1">{{ totalPagos() }}</p>
        </div>
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p class="text-xs font-medium text-yellow-600 uppercase tracking-wider">Pendentes</p>
          <p class="text-2xl font-bold text-yellow-700 mt-1">{{ totalPendentes() }}</p>
        </div>
        <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p class="text-xs font-medium text-red-600 uppercase tracking-wider">Atrasados</p>
          <p class="text-2xl font-bold text-red-700 mt-1">{{ totalAtrasados() }}</p>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }

      @if (!loading() && mensalidades().length === 0) {
        <div class="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p class="text-gray-500 font-medium">Nenhum lançamento encontrado</p>
        </div>
      }

      @if (!loading() && mensalidades().length > 0) {
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Desbravador</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Competência</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (m of mensalidades(); track m.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <p class="font-medium text-gray-900">{{ m.pathfinder?.full_name || '—' }}</p>
                    @if (m.pathfinder?.unit?.name) {
                      <p class="text-xs text-gray-400">{{ m.pathfinder!.unit!.name }}</p>
                    }
                  </td>
                  <td class="px-6 py-4 text-gray-600">{{ formatarCompetencia(m.reference_month) }}</td>
                  <td class="px-6 py-4 font-medium text-gray-900">{{ m.amount | currency:'BRL' }}</td>
                  <td class="px-6 py-4 text-gray-500 text-xs">{{ m.due_date | date:'dd/MM/yyyy' }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" [ngClass]="statusClass(m.status)">
                      {{ statusLabel(m.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      @if (m.status !== 'paid') {
                        <button (click)="marcarPago(m)" class="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                          Pagar
                        </button>
                      }
                      <button (click)="abrirFormulario(m)" class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button (click)="confirmarExclusao(m)" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <h3 class="text-lg font-semibold text-gray-900">{{ editando() ? 'Editar Mensalidade' : 'Nova Mensalidade' }}</h3>
            <button (click)="fecharFormulario()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form [formGroup]="form" (ngSubmit)="salvar()" class="p-6 space-y-4">

            <!-- Desbravador -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Desbravador <span class="text-red-500">*</span></label>
              @if (carregandoDesbravadores()) {
                <div class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-400 bg-gray-50">Carregando...</div>
              } @else {
                <select formControlName="pathfinder_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="">Selecione um desbravador...</option>
                  @for (d of desbravadores(); track d.id) {
                    <option [value]="d.id">{{ d.full_name }}{{ d.unit?.name ? ' — ' + d.unit!.name : '' }}</option>
                  }
                </select>
                @if (desbravadores().length === 0) {
                  <p class="text-xs text-amber-600 mt-1">Nenhum desbravador encontrado. Cadastre desbravadores primeiro.</p>
                }
              }
            </div>

            <!-- Mês/Ano -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mês <span class="text-red-500">*</span></label>
                <select formControlName="mes" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @for (m of meses; track m.value) {
                    <option [value]="m.value">{{ m.label }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ano <span class="text-red-500">*</span></label>
                <input formControlName="ano" type="number" min="2000" max="2099" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            <!-- Valor e Vencimento -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor (R$) <span class="text-red-500">*</span></label>
                <input formControlName="amount" type="number" step="0.01" min="0.01" placeholder="0,00" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Vencimento <span class="text-red-500">*</span></label>
                <input formControlName="due_date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            <!-- Status e Pgto -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select formControlName="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                  <option value="overdue">Atrasado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data do Pagamento</label>
                <input formControlName="payment_date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Observação</label>
              <textarea formControlName="notes" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
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

    <!-- Confirm Delete -->
    @if (paraExcluir()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Excluir Mensalidade</h3>
              <p class="text-sm text-gray-500">Tem certeza que deseja excluir este lançamento?</p>
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
export class MensalidadesComponent implements OnInit {
  private service = inject(MensalidadeService);
  private desbravadorService = inject(DesbravadorService);
  private fb = inject(FormBuilder);

  readonly mensalidades = signal<Mensalidade[]>([]);
  readonly desbravadores = signal<Desbravador[]>([]);
  readonly loading = signal(true);
  readonly carregandoDesbravadores = signal(false);
  readonly modalAberto = signal(false);
  readonly salvando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly editando = signal<Mensalidade | null>(null);
  readonly paraExcluir = signal<Mensalidade | null>(null);

  readonly filtroMes = signal(new Date().getMonth() + 1);
  readonly filtroAno = signal(new Date().getFullYear());
  readonly filtroStatus = signal<string>('');

  readonly totalPagos = computed(() => this.mensalidades().filter(m => m.status === 'paid').length);
  readonly totalPendentes = computed(() => this.mensalidades().filter(m => m.status === 'pending').length);
  readonly totalAtrasados = computed(() => this.mensalidades().filter(m => m.status === 'overdue').length);

  readonly meses = MESES;
  readonly anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // O form usa campos auxiliares mes/ano que serão convertidos para reference_month ao salvar
  form = this.fb.group({
    pathfinder_id: ['', Validators.required],
    mes: [new Date().getMonth() + 1, Validators.required],
    ano: [new Date().getFullYear(), Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    due_date: ['', Validators.required],
    status: ['pending' as StatusMensalidade],
    payment_date: [''],
    notes: ['']
  });

  ngOnInit(): void {
    this.carregar();
    this.carregarDesbravadores();
  }

  carregar(): void {
    this.loading.set(true);
    this.service.listar({
      mes: this.filtroMes() || undefined,
      ano: this.filtroAno() || undefined,
      status: (this.filtroStatus() as StatusMensalidade) || undefined
    }).subscribe(data => {
      this.mensalidades.set(data);
      this.loading.set(false);
    });
  }

  carregarDesbravadores(): void {
    this.carregandoDesbravadores.set(true);
    this.desbravadorService.listar().subscribe(data => {
      this.desbravadores.set(data.sort((a, b) => a.full_name.localeCompare(b.full_name)));
      this.carregandoDesbravadores.set(false);
    });
  }

  aplicarFiltros(): void { this.carregar(); }

  abrirFormulario(m?: Mensalidade): void {
    this.editando.set(m ?? null);
    this.erro.set(null);
    const { mes, ano } = m ? fromReferenceMonth(m.reference_month) : { mes: new Date().getMonth() + 1, ano: new Date().getFullYear() };
    this.form.reset({
      pathfinder_id: m?.pathfinder_id ?? '',
      mes,
      ano,
      amount: m?.amount ?? 0,
      due_date: m?.due_date ?? '',
      status: m?.status ?? 'pending',
      payment_date: m?.payment_date ?? '',
      notes: m?.notes ?? ''
    });
    this.modalAberto.set(true);
  }

  fecharFormulario(): void { this.modalAberto.set(false); this.editando.set(null); }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando.set(true);
    this.erro.set(null);
    const raw = this.form.value;
    const formValue: MensalidadeForm = {
      pathfinder_id: raw.pathfinder_id!,
      reference_month: toReferenceMonth(raw.mes!, raw.ano!),
      amount: raw.amount!,
      due_date: raw.due_date!,
      status: raw.status as StatusMensalidade,
      payment_date: raw.payment_date || undefined,
      notes: raw.notes || undefined
    };
    const editando = this.editando();
    const obs = editando
      ? this.service.atualizar(editando.id, formValue)
      : this.service.criar(formValue);
    obs.subscribe(result => {
      this.salvando.set(false);
      if (result) { this.fecharFormulario(); this.carregar(); }
      else this.erro.set('Erro ao salvar. Verifique os dados e tente novamente.');
    });
  }

  marcarPago(m: Mensalidade): void {
    this.service.marcarPago(m.id).subscribe(result => {
      if (result) this.carregar();
    });
  }

  confirmarExclusao(m: Mensalidade): void { this.paraExcluir.set(m); }

  excluir(): void {
    const m = this.paraExcluir();
    if (!m) return;
    this.service.excluir(m.id).subscribe(ok => {
      this.paraExcluir.set(null);
      if (ok) this.carregar();
    });
  }

  formatarCompetencia(referenceMonth: string): string {
    const { mes, ano } = fromReferenceMonth(referenceMonth);
    const nomeMes = MESES.find(m => m.value === mes)?.label ?? String(mes);
    return `${nomeMes}/${ano}`;
  }

  statusLabel(status: StatusMensalidade): string {
    return STATUS_MENSALIDADE_LABELS[status] ?? status;
  }

  statusClass(status: StatusMensalidade): string {
    return STATUS_MENSALIDADE_CLASS[status] ?? 'bg-gray-100 text-gray-700';
  }
}
