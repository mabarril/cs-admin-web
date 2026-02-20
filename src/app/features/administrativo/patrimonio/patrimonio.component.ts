import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatrimonioService } from './patrimonio.service';
import { Asset, AssetStatus, ASSET_STATUS_LABELS } from '../administrativo.model';

@Component({
    selector: 'app-patrimonio',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Patrimônio</h1>
          <p class="page-subtitle">Controle de bens patrimoniais do clube</p>
        </div>
        <button class="btn btn-primary" (click)="abrirModal()">+ Novo Bem</button>
      </div>

      <!-- Filtro por status -->
      <div class="filter-bar">
        <label class="filter-label">Filtrar por status:</label>
        <select class="form-control filter-select" [(ngModel)]="filtroStatus" (change)="aplicarFiltro()">
          <option value="">Todos</option>
          <option value="active">Ativo</option>
          <option value="maintenance">Em manutenção</option>
          <option value="inactive">Inativo</option>
          <option value="disposed">Descartado</option>
        </select>
      </div>

      <!-- Mensagem de erro -->
      @if (erro()) {
        <div class="alert alert-error">{{ erro() }}</div>
      }

      <!-- Tabela -->
      <div class="table-card">
        @if (carregando()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <span>Carregando patrimônio...</span>
          </div>
        } @else if (itensFiltrados().length === 0) {
          <div class="empty-state">
            <span class="empty-icon">🏛️</span>
            <p>Nenhum bem patrimonial encontrado.</p>
          </div>
        } @else {
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Localização</th>
                  <th>Valor Atual</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                @for (item of itensFiltrados(); track item.id) {
                  <tr>
                    <td><code class="asset-code">{{ item.asset_code }}</code></td>
                    <td class="font-medium">{{ item.name }}</td>
                    <td>{{ item.category || '—' }}</td>
                    <td>{{ item.location || '—' }}</td>
                    <td>{{ item.current_value != null ? (item.current_value | currency:'BRL') : '—' }}</td>
                    <td>
                      <span class="badge" [class]="'badge-' + (item.status || 'active')">
                        {{ statusLabel(item.status) }}
                      </span>
                    </td>
                    <td class="actions-cell">
                      <button class="btn btn-ghost btn-sm" (click)="abrirModal(item)" title="Editar">✏️</button>
                      <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmarExclusao(item)" title="Excluir">🗑️</button>
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
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ itemEditando()?.id ? 'Editar Bem' : 'Novo Bem Patrimonial' }}</h2>
            <button class="btn-close" (click)="fecharModal()">✕</button>
          </div>
          <form (ngSubmit)="salvar()" #f="ngForm" class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Código *</label>
                <input class="form-control" name="asset_code" [(ngModel)]="form.asset_code" required placeholder="PAT-001" />
              </div>
              <div class="form-group">
                <label>Status</label>
                <select class="form-control" name="status" [(ngModel)]="form.status">
                  <option value="active">Ativo</option>
                  <option value="maintenance">Em manutenção</option>
                  <option value="inactive">Inativo</option>
                  <option value="disposed">Descartado</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Nome *</label>
              <input class="form-control" name="name" [(ngModel)]="form.name" required placeholder="Nome do bem" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Categoria</label>
                <input class="form-control" name="category" [(ngModel)]="form.category" placeholder="Ex: Equipamento, Mobiliário..." />
              </div>
              <div class="form-group">
                <label>Localização</label>
                <input class="form-control" name="location" [(ngModel)]="form.location" placeholder="Sala, armário..." />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Data de Aquisição</label>
                <input class="form-control" type="date" name="acquisition_date" [(ngModel)]="form.acquisition_date" />
              </div>
              <div class="form-group">
                <label>Valor de Aquisição (R$)</label>
                <input class="form-control" type="number" step="0.01" name="acquisition_value" [(ngModel)]="form.acquisition_value" placeholder="0,00" />
              </div>
            </div>
            <div class="form-group">
              <label>Valor Atual (R$)</label>
              <input class="form-control" type="number" step="0.01" name="current_value" [(ngModel)]="form.current_value" placeholder="0,00" />
            </div>
            <div class="form-group">
              <label>Descrição</label>
              <textarea class="form-control" name="description" [(ngModel)]="form.description" rows="2" placeholder="Detalhes do bem..."></textarea>
            </div>
            <div class="form-group">
              <label>Observações</label>
              <textarea class="form-control" name="notes" [(ngModel)]="form.notes" rows="2" placeholder="Observações adicionais..."></textarea>
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

    <!-- Dialog de confirmação de exclusão -->
    @if (itemParaExcluir()) {
      <div class="modal-overlay">
        <div class="confirm-box">
          <h3>Excluir bem patrimonial?</h3>
          <p>Deseja excluir <strong>{{ itemParaExcluir()!.name }}</strong> ({{ itemParaExcluir()!.asset_code }})? Esta ação não pode ser desfeita.</p>
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

    .filter-bar { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
    .filter-label { font-size: 0.875rem; font-weight: 500; color: var(--text-secondary, #64748b); white-space: nowrap; }
    .filter-select { width: auto; min-width: 160px; }

    .table-card { background: var(--surface, #fff); border-radius: 12px; border: 1px solid var(--border, #e2e8f0); overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
    .table-responsive { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: var(--surface-2, #f8fafc); padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--text-secondary, #64748b); border-bottom: 1px solid var(--border, #e2e8f0); }
    .table td { padding: 0.875rem 1rem; border-bottom: 1px solid var(--border, #e2e8f0); font-size: 0.875rem; color: var(--text-primary, #1e293b); }
    .table tr:last-child td { border-bottom: none; }
    .table tr:hover td { background: var(--surface-2, #f8fafc); }
    .font-medium { font-weight: 500; }
    .asset-code { background: var(--surface-2, #f1f5f9); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-family: monospace; }

    .loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 3rem; color: var(--text-secondary, #64748b); }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--border, #e2e8f0); border-top-color: var(--primary, #6366f1); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-icon { font-size: 2.5rem; }

    .badge { padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.72rem; font-weight: 600; }
    .badge-active { background: #dcfce7; color: #15803d; }
    .badge-maintenance { background: #fef9c3; color: #a16207; }
    .badge-inactive { background: #f1f5f9; color: #475569; }
    .badge-disposed { background: #fee2e2; color: #b91c1c; }

    .actions-cell { display: flex; gap: 0.25rem; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: none; transition: all .15s; }
    .btn-primary { background: var(--primary, #6366f1); color: #fff; }
    .btn-primary:hover:not(:disabled) { background: var(--primary-dark, #4f46e5); }
    .btn-ghost { background: transparent; color: var(--text-primary, #1e293b); border: 1px solid var(--border, #e2e8f0); }
    .btn-ghost:hover { background: var(--surface-2, #f8fafc); }
    .btn-danger { background: #ef4444; color: #fff; }
    .btn-danger:hover:not(:disabled) { background: #dc2626; }
    .btn-sm { padding: 0.3rem 0.5rem; font-size: 0.8rem; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1rem; }
    .alert-error { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal-box { background: var(--surface, #fff); border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,.15); }
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
export class PatrimonioComponent implements OnInit {
    private svc = inject(PatrimonioService);

    items = signal<Asset[]>([]);
    itensFiltrados = signal<Asset[]>([]);
    carregando = signal(false);
    erro = signal<string | null>(null);
    modalAberto = signal(false);
    salvando = signal(false);
    erroModal = signal<string | null>(null);
    itemEditando = signal<Asset | null>(null);
    itemParaExcluir = signal<Asset | null>(null);
    excluindo = signal(false);
    filtroStatus = '';

    form: Partial<Asset> = this.formVazio();

    formVazio(): Partial<Asset> {
        return { asset_code: '', name: '', status: 'active', category: '', location: '', description: '', notes: '', acquisition_date: '', acquisition_value: undefined, current_value: undefined };
    }

    statusLabel(status?: AssetStatus | string) {
        return ASSET_STATUS_LABELS[(status as AssetStatus)] ?? status ?? '—';
    }

    async ngOnInit() {
        await this.carregar();
    }

    async carregar() {
        this.carregando.set(true);
        this.erro.set(null);
        try {
            const data = await this.svc.listar();
            this.items.set(data);
            this.aplicarFiltro();
        } catch {
            this.erro.set('Erro ao carregar patrimônio.');
        } finally {
            this.carregando.set(false);
        }
    }

    aplicarFiltro() {
        const all = this.items();
        this.itensFiltrados.set(this.filtroStatus ? all.filter(i => i.status === this.filtroStatus) : all);
    }

    abrirModal(item?: Asset) {
        this.itemEditando.set(item ?? null);
        this.form = item ? { ...item } : this.formVazio();
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
            const id = this.itemEditando()?.id;
            if (id) {
                await this.svc.atualizar(id, this.form);
            } else {
                await this.svc.criar(this.form as Omit<Asset, 'id' | 'created_at' | 'updated_at'>);
            }
            await this.carregar();
            this.fecharModal();
        } catch {
            this.erroModal.set('Erro ao salvar. Verifique os dados e tente novamente.');
        } finally {
            this.salvando.set(false);
        }
    }

    confirmarExclusao(item: Asset) {
        this.itemParaExcluir.set(item);
    }

    async excluir() {
        const item = this.itemParaExcluir();
        if (!item?.id) return;
        this.excluindo.set(true);
        try {
            await this.svc.excluir(item.id);
            await this.carregar();
            this.itemParaExcluir.set(null);
        } catch {
            this.erro.set('Erro ao excluir bem.');
        } finally {
            this.excluindo.set(false);
        }
    }
}
