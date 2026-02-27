import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClasseService } from '../services/classe.service';
import { Classe, ClasseForm } from '../../../core/models/cadastros.model';

const CLASSES_PADRAO = [
    { name: 'Amigo', color: '#0066CC' },
    { name: 'Companheiro', color: '#CC0000' },
    { name: 'Pesquisador', color: '#00CC00' },
    { name: 'Pioneiro', color: '#FF9900' },
    { name: 'Excursionista', color: '#9933CC' },
    { name: 'Guia', color: '#CC6600' },
];

@Component({
    selector: 'app-classes',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Classes</h2>
          <p class="text-sm text-gray-500 mt-1">Gerencie as classes de desbravadores</p>
        </div>
        <button (click)="abrirFormulario()" class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nova Classe
        </button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }

      @if (!loading() && classes().length === 0) {
        <div class="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p class="text-gray-500 font-medium">Nenhuma classe cadastrada</p>
        </div>
      }

      @if (!loading() && classes().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (classe of classes(); track classe.id) {
            <div class="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div class="w-12 h-12 rounded-full flex-shrink-0 border-4 border-white shadow-md" [style.background-color]="classe.color_hex"></div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 truncate">{{ classe.name }}</p>
                <p class="text-xs text-gray-400">Ordem: {{ classe.order_index }}</p>
              </div>
              <div class="flex gap-1">
                <button (click)="abrirFormulario(classe)" class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button (click)="confirmarExclusao(classe)" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path stroke-linecap="round" stroke-linejoin="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2"/></svg>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>

    @if (modalAberto()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="fecharFormulario()">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">{{ editando() ? 'Editar Classe' : 'Nova Classe' }}</h3>
            <button (click)="fecharFormulario()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form [formGroup]="form" (ngSubmit)="salvar()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome <span class="text-red-500">*</span></label>
              <input formControlName="name" type="text" placeholder="Ex: Amigo" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cor <span class="text-red-500">*</span></label>
                <div class="flex items-center gap-2">
                  <input formControlName="color_hex" type="color" class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
                  <input formControlName="color_hex" type="text" placeholder="#0066CC" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ordem <span class="text-red-500">*</span></label>
                <input formControlName="order_index" type="number" min="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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

    @if (classeParaExcluir()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Excluir Classe</h3>
              <p class="text-sm text-gray-500">Tem certeza que deseja excluir <strong>{{ classeParaExcluir()!.name }}</strong>?</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button (click)="classeParaExcluir.set(null)" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">Cancelar</button>
            <button (click)="excluir()" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">Excluir</button>
          </div>
        </div>
      </div>
    }
  `
})
export class ClassesComponent implements OnInit {
    private service = inject(ClasseService);
    private fb = inject(FormBuilder);

    readonly classes = signal<Classe[]>([]);
    readonly loading = signal(true);
    readonly modalAberto = signal(false);
    readonly salvando = signal(false);
    readonly erro = signal<string | null>(null);
    readonly editando = signal<Classe | null>(null);
    readonly classeParaExcluir = signal<Classe | null>(null);

    form = this.fb.group({
        name: ['', Validators.required],
        color_hex: ['#0066CC', Validators.required],
        order_index: [1, [Validators.required, Validators.min(1)]]
    });

    ngOnInit(): void { this.carregar(); }

    carregar(): void {
        this.loading.set(true);
        this.service.listar().subscribe(data => {
            this.classes.set(data);
            this.loading.set(false);
        });
    }

    abrirFormulario(classe?: Classe): void {
        this.editando.set(classe ?? null);
        this.erro.set(null);
        this.form.reset({
            name: classe?.name ?? '',
            color_hex: classe?.color_hex ?? '#0066CC',
            order_index: classe?.order_index ?? (this.classes().length + 1)
        });
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
        const formValue = this.form.value as ClasseForm;
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

    confirmarExclusao(classe: Classe): void { this.classeParaExcluir.set(classe); }

    excluir(): void {
        const classe = this.classeParaExcluir();
        if (!classe) return;
        this.service.excluir(classe.id).subscribe(ok => {
            this.classeParaExcluir.set(null);
            if (ok) this.carregar();
        });
    }
}
