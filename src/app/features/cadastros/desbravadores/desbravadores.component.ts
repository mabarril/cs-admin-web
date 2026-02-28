import { Component, inject, signal, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DesbravadorService } from '../services/desbravador.service';
import { UnidadeService } from '../services/unidade.service';
import { ClasseService } from '../services/classe.service';
import { Desbravador, DesbravadorForm, Unidade, Classe, GENERO_LABELS } from '../../../core/models/cadastros.model';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';

@Component({
    selector: 'app-desbravadores',
    imports: [ReactiveFormsModule, UppercaseDirective],
    template: `
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Desbravadores</h2>
          <p class="text-sm text-gray-500 mt-1">{{ desbravadores().length }} desbravador(es) cadastrado(s)</p>
        </div>
        <button (click)="abrirFormulario()" class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo Desbravador
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }

      @if (!loading() && desbravadores().length === 0) {
        <div class="text-center py-16 bg-white rounded-xl border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <p class="text-gray-500 font-medium">Nenhum desbravador cadastrado</p>
        </div>
      }

      @if (!loading() && desbravadores().length > 0) {
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Idade</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unidade</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Classe</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (d of desbravadores(); track d.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs flex-shrink-0">
                        {{ getInitials(d.full_name) }}
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ d.full_name }}</p>
                        @if (d.user_code) { <p class="text-xs text-gray-400">{{ d.user_code }}</p> }
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-600">{{ service.calcularIdade(d.birth_date) }} anos</td>
                  <td class="px-6 py-4 text-gray-600">{{ d.unit?.name || '—' }}</td>
                  <td class="px-6 py-4">
                    @if (d.class) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white" [style.background-color]="d.class.color_hex">
                        {{ d.class.name }}
                      </span>
                    } @else { <span class="text-gray-400">—</span> }
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button (click)="abrirFormulario(d)" class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button (click)="confirmarExclusao(d)" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
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
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
            <h3 class="text-lg font-semibold text-gray-900">{{ editando() ? 'Editar Desbravador' : 'Novo Desbravador' }}</h3>
            <button (click)="fecharFormulario()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form [formGroup]="form" (ngSubmit)="salvar()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo <span class="text-red-500">*</span></label>
              <input formControlName="full_name" appUppercase type="text" placeholder="Nome do desbravador" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento <span class="text-red-500">*</span></label>
                <input formControlName="birth_date" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                <select formControlName="gender" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Selecione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                <select formControlName="unit_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Sem unidade</option>
                  @for (u of unidades(); track u.id) {
                    <option [value]="u.id">{{ u.name }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                <select formControlName="class_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Sem classe</option>
                  @for (c of classesDisponiveis(); track c.id) {
                    <option [value]="c.id">{{ c.name }}</option>
                  }
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input formControlName="user_code" type="text" placeholder="Ex: DSB-001" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cargo/Função</label>
                <input formControlName="position" type="text" placeholder="Ex: Capitão" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
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

    @if (desbravadorParaExcluir()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Excluir Desbravador</h3>
              <p class="text-sm text-gray-500">Tem certeza que deseja excluir <strong>{{ desbravadorParaExcluir()!.full_name }}</strong>?</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button (click)="desbravadorParaExcluir.set(null)" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">Cancelar</button>
            <button (click)="excluir()" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">Excluir</button>
          </div>
        </div>
      </div>
    }
  `
})
export class DesbravadoresComponent implements OnInit {
    readonly service = inject(DesbravadorService);
    private unidadeService = inject(UnidadeService);
    private classeService = inject(ClasseService);
    private fb = inject(FormBuilder);

    readonly desbravadores = signal<Desbravador[]>([]);
    readonly unidades = signal<Unidade[]>([]);
    readonly classesDisponiveis = signal<Classe[]>([]);
    readonly loading = signal(true);
    readonly modalAberto = signal(false);
    readonly salvando = signal(false);
    readonly erro = signal<string | null>(null);
    readonly editando = signal<Desbravador | null>(null);
    readonly desbravadorParaExcluir = signal<Desbravador | null>(null);

    form = this.fb.group({
        full_name: ['', Validators.required],
        birth_date: ['', Validators.required],
        gender: [''],
        unit_id: [''],
        class_id: [''],
        user_code: [''],
        position: ['']
    });

    ngOnInit(): void {
        this.carregar();
        this.unidadeService.listar().subscribe(u => this.unidades.set(u));
        this.classeService.listar().subscribe(c => this.classesDisponiveis.set(c));
    }

    carregar(): void {
        this.loading.set(true);
        this.service.listar().subscribe(data => {
            this.desbravadores.set(data);
            this.loading.set(false);
        });
    }

    abrirFormulario(d?: Desbravador): void {
        this.editando.set(d ?? null);
        this.erro.set(null);
        this.form.reset({
            full_name: d?.full_name ?? '',
            birth_date: d?.birth_date ?? '',
            gender: d?.gender ?? '',
            unit_id: d?.unit_id ?? '',
            class_id: d?.class_id ?? '',
            user_code: d?.user_code ?? '',
            position: d?.position ?? ''
        });
        this.modalAberto.set(true);
    }

    fecharFormulario(): void { this.modalAberto.set(false); this.editando.set(null); }

    salvar(): void {
        if (this.form.invalid) return;
        this.salvando.set(true);
        this.erro.set(null);
        const raw = this.form.value;
        const formValue: DesbravadorForm = {
            full_name: raw.full_name!,
            birth_date: raw.birth_date!,
            gender: (raw.gender as any) || undefined,
            unit_id: raw.unit_id || undefined,
            class_id: raw.class_id || undefined,
            user_code: raw.user_code || undefined,
            position: raw.position || undefined,
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

    getInitials(fullName: string): string {
        return fullName
            .split(' ')
            .filter(n => n.length > 0)
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    confirmarExclusao(d: Desbravador): void { this.desbravadorParaExcluir.set(d); }

    excluir(): void {
        const d = this.desbravadorParaExcluir();
        if (!d) return;
        this.service.excluir(d.id).subscribe(ok => {
            this.desbravadorParaExcluir.set(null);
            if (ok) this.carregar();
        });
    }
}
