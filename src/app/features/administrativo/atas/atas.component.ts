import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtaService } from './ata.service';
import { Ata } from '../administrativo.model';

@Component({
    selector: 'app-atas',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Livro de Atas</h1>
          <p class="page-subtitle">Registro de atas de reuniões do clube</p>
        </div>
        <button class="btn btn-primary" (click)="abrirModal()">+ Nova Ata</button>
      </div>

      @if (erro()) {
        <div class="alert alert-error">{{ erro() }}</div>
      }

      <div class="table-card">
        @if (carregando()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <span>Carregando atas...</span>
          </div>
        } @else if (items().length === 0) {
          <div class="empty-state">
            <span class="empty-icon">📋</span>
            <p>Nenhuma ata registrada ainda.</p>
          </div>
        } @else {
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Participantes</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                @for (item of items(); track item.id) {
                  <tr>
                    <td><span class="number-badge">{{ item.meeting_number }}</span></td>
                    <td>{{ item.meeting_date | date:'dd/MM/yyyy' }}</td>
                    <td>{{ item.meeting_type || '—' }}</td>
                    <td class="font-medium">{{ item.title }}</td>
                    <td>
                      @if (item.attendees?.length) {
                        <span class="badge badge-neutral">{{ item.attendees!.length }} presente(s)</span>
                      } @else {
                        <span class="text-muted">—</span>
                      }
                    </td>
                    <td class="actions-cell">
                      <button class="btn btn-ghost btn-sm" (click)="abrirModal(item)" title="Editar">✏️</button>
                      <button class="btn btn-ghost btn-sm btn-danger-ghost" (click)="confirmarExclusao(item)" title="Excluir">🗑️</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    <!-- Modal CRUD -->
    @if (modalAberto()) {
      <div class="modal-overlay" (click)="fecharModal()">
        <div class="modal-box wide" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ itemEditando()?.id ? 'Editar Ata' : 'Nova Ata' }}</h2>
            <button class="btn-close" (click)="fecharModal()">✕</button>
          </div>
          <form (ngSubmit)="salvar()" #f="ngForm" class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Número da Ata *</label>
                <input class="form-control" type="number" name="meeting_number" [(ngModel)]="form.meeting_number" required placeholder="1" />
              </div>
              <div class="form-group">
                <label>Data da Reunião *</label>
                <input class="form-control" type="date" name="meeting_date" [(ngModel)]="form.meeting_date" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Tipo de Reunião</label>
                <input class="form-control" name="meeting_type" [(ngModel)]="form.meeting_type" placeholder="Ex: Diretoria, Conselho..." />
              </div>
              <div class="form-group">
                <label>Título *</label>
                <input class="form-control" name="title" [(ngModel)]="form.title" required placeholder="Título da ata" />
              </div>
            </div>
            <div class="form-group">
              <label>Participantes <span class="hint">(separados por vírgula)</span></label>
              <input class="form-control" name="attendees_raw" [(ngModel)]="attendeesRaw" placeholder="João Silva, Maria Oliveira..." />
            </div>
            <div class="form-group">
              <label>Conteúdo *</label>
              <textarea class="form-control" name="content" [(ngModel)]="form.content" rows="8" required placeholder="Texto completo da ata..."></textarea>
            </div>

            @if (erroModal()) {
              <div class="alert alert-error">{{ erroModal() }}</div>
            }

            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" (click)="fecharModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="salvando() || !f.valid">
                {{ salvando() ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Confirmação de exclusão -->
    @if (itemParaExcluir()) {
      <div class="modal-overlay">
        <div class="confirm-box">
          <h3>Excluir ata?</h3>
          <p>Deseja excluir a ata <strong>Nº {{ itemParaExcluir()!.meeting_number }} — {{ itemParaExcluir()!.title }}</strong>? Esta ação não pode ser desfeita.</p>
          <div class="confirm-actions">
            <button class="btn btn-ghost" (click)="itemParaExcluir.set(null)">Cancelar</button>
            <button class="btn btn-danger" (click)="excluir()" [disabled]="excluindo()">
              {{ excluindo() ? 'Excluindo...' : 'Excluir' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
    styles: [`
    .page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary, #1e293b); margin: 0 0 0.25rem; }
    .page-subtitle { color: var(--text-secondary, #64748b); margin: 0; font-size: 0.9rem; }
    .text-muted { color: var(--text-secondary, #94a3b8); }

    .table-card { background: var(--surface, #fff); border-radius: 12px; border: 1px solid var(--border, #e2e8f0); overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
    .table-responsive { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: var(--surface-2, #f8fafc); padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--text-secondary, #64748b); border-bottom: 1px solid var(--border, #e2e8f0); }
    .table td { padding: 0.875rem 1rem; border-bottom: 1px solid var(--border, #e2e8f0); font-size: 0.875rem; color: var(--text-primary, #1e293b); }
    .table tr:last-child td { border-bottom: none; }
    .table tr:hover td { background: var(--surface-2, #f8fafc); }
    .font-medium { font-weight: 500; }
    .number-badge { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: var(--primary, #6366f1); color: #fff; border-radius: 50%; font-size: 0.8rem; font-weight: 700; }

    .loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 3rem; color: var(--text-secondary, #64748b); }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--border, #e2e8f0); border-top-color: var(--primary, #6366f1); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-icon { font-size: 2.5rem; }

    .badge { padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.72rem; font-weight: 600; }
    .badge-neutral { background: #f1f5f9; color: #475569; }

    .actions-cell { display: flex; gap: 0.25rem; }
    .hint { font-weight: 400; color: var(--text-secondary, #94a3b8); text-transform: none; letter-spacing: 0; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: none; transition: all .15s; }
    .btn-primary { background: var(--primary, #6366f1); color: #fff; }
    .btn-primary:hover:not(:disabled) { background: var(--primary-dark, #4f46e5); }
    .btn-ghost { background: transparent; color: var(--text-primary, #1e293b); border: 1px solid var(--border, #e2e8f0); }
    .btn-ghost:hover { background: var(--surface-2, #f8fafc); }
    .btn-danger { background: #ef4444; color: #fff; }
    .btn-danger:hover:not(:disabled) { background: #dc2626; }
    .btn-danger-ghost:hover { color: #ef4444; border-color: #ef4444; }
    .btn-sm { padding: 0.3rem 0.5rem; font-size: 0.8rem; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1rem; }
    .alert-error { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal-box { background: var(--surface, #fff); border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,.15); }
    .modal-box.wide { max-width: 780px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid var(--border, #e2e8f0); }
    .modal-header h2 { font-size: 1.2rem; font-weight: 700; margin: 0; color: var(--text-primary, #1e293b); }
    .btn-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--text-secondary, #64748b); padding: 0.25rem; border-radius: 4px; }
    .btn-close:hover { background: var(--surface-2, #f8fafc); }
    .modal-body { padding: 1.5rem; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border, #e2e8f0); }

    .form-group { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem; }
    .form-group label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary, #64748b); text-transform: uppercase; letter-spacing: .03em; }
    .form-control { padding: 0.6rem 0.875rem; border: 1px solid var(--border, #e2e8f0); border-radius: 8px; font-size: 0.875rem; background: var(--surface, #fff); color: var(--text-primary, #1e293b); transition: border-color .15s; width: 100%; box-sizing: border-box; }
    .form-control:focus { outline: none; border-color: var(--primary, #6366f1); box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    .confirm-box { background: var(--surface, #fff); border-radius: 16px; padding: 2rem; width: 100%; max-width: 440px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,.15); }
    .confirm-box h3 { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.75rem; }
    .confirm-box p { color: var(--text-secondary, #64748b); font-size: 0.9rem; margin: 0 0 1.5rem; }
    .confirm-actions { display: flex; justify-content: center; gap: 0.75rem; }
  `]
})
export class AtasComponent implements OnInit {
    private svc = inject(AtaService);

    items = signal<Ata[]>([]);
    carregando = signal(false);
    erro = signal<string | null>(null);
    modalAberto = signal(false);
    salvando = signal(false);
    erroModal = signal<string | null>(null);
    itemEditando = signal<Ata | null>(null);
    itemParaExcluir = signal<Ata | null>(null);
    excluindo = signal(false);

    form: Partial<Ata> = this.formVazio();
    attendeesRaw = '';

    formVazio(): Partial<Ata> {
        return { meeting_number: undefined, meeting_date: '', meeting_type: '', title: '', content: '' };
    }

    async ngOnInit() { await this.carregar(); }

    async carregar() {
        this.carregando.set(true);
        this.erro.set(null);
        try {
            this.items.set(await this.svc.listar());
        } catch {
            this.erro.set('Erro ao carregar atas.');
        } finally {
            this.carregando.set(false);
        }
    }

    abrirModal(item?: Ata) {
        this.itemEditando.set(item ?? null);
        this.form = item ? { ...item } : this.formVazio();
        this.attendeesRaw = item?.attendees?.join(', ') ?? '';
        this.erroModal.set(null);
        this.modalAberto.set(true);
    }

    fecharModal() {
        this.modalAberto.set(false);
        this.itemEditando.set(null);
    }

    async salvar() {
        this.salvando.set(true);
        this.erroModal.set(null);
        try {
            const payload: Partial<Ata> = {
                ...this.form,
                attendees: this.attendeesRaw
                    ? this.attendeesRaw.split(',').map(s => s.trim()).filter(Boolean)
                    : [],
            };
            const id = this.itemEditando()?.id;
            if (id) {
                await this.svc.atualizar(id, payload);
            } else {
                await this.svc.criar(payload as Omit<Ata, 'id' | 'created_at' | 'updated_at'>);
            }
            await this.carregar();
            this.fecharModal();
        } catch {
            this.erroModal.set('Erro ao salvar. Verifique os dados e tente novamente.');
        } finally {
            this.salvando.set(false);
        }
    }

    confirmarExclusao(item: Ata) { this.itemParaExcluir.set(item); }

    async excluir() {
        const item = this.itemParaExcluir();
        if (!item?.id) return;
        this.excluindo.set(true);
        try {
            await this.svc.excluir(item.id);
            await this.carregar();
            this.itemParaExcluir.set(null);
        } catch {
            this.erro.set('Erro ao excluir ata.');
        } finally {
            this.excluindo.set(false);
        }
    }
}
