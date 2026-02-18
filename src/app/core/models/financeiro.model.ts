/**
 * Financeiro module models
 * Mapeados conforme schema real do banco (01_schema.sql)
 */

// ─── Mensalidades (monthly_fees) ─────────────────────────────────────────────

export type StatusMensalidade = 'pending' | 'paid' | 'overdue' | 'cancelled';

export const STATUS_MENSALIDADE_LABELS: Record<StatusMensalidade, string> = {
    pending: 'Pendente',
    paid: 'Pago',
    overdue: 'Atrasado',
    cancelled: 'Cancelado'
};

export const STATUS_MENSALIDADE_CLASS: Record<StatusMensalidade, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-500'
};

export interface Mensalidade {
    id: string;
    pathfinder_id: string;
    reference_month: string;   // DATE — 'YYYY-MM-01'
    amount: number;
    due_date: string;          // DATE
    payment_date?: string;     // DATE
    status: StatusMensalidade;
    notes?: string;
    created_at: string;
    updated_at: string;
    // joined
    pathfinder?: { id: string; full_name: string; unit?: { name: string } };
}

export interface MensalidadeForm {
    pathfinder_id: string;
    reference_month: string;   // 'YYYY-MM-01'
    amount: number;
    due_date: string;
    payment_date?: string;
    status: StatusMensalidade;
    notes?: string;
}

// ─── Caixa (cash_transactions) ───────────────────────────────────────────────

export type TipoLancamento = 'income' | 'expense';

export const TIPO_LANCAMENTO_LABELS: Record<TipoLancamento, string> = {
    income: 'Entrada',
    expense: 'Saída'
};

export interface LancamentoCaixa {
    id: string;
    transaction_date: string;   // DATE
    description: string;
    category_id?: string;
    type: TipoLancamento;
    amount: number;
    payment_method?: string;
    notes?: string;
    created_by?: string;
    created_at: string;
    updated_at: string;
    // joined
    category?: { name: string };
}

export interface LancamentoCaixaForm {
    transaction_date: string;
    description: string;
    type: TipoLancamento;
    amount: number;
    payment_method?: string;
    notes?: string;
    category_id?: string;
}

// ─── Custos (costs) ──────────────────────────────────────────────────────────

export type StatusCusto = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export const STATUS_CUSTO_LABELS: Record<StatusCusto, string> = {
    planned: 'Planejado',
    in_progress: 'Em andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado'
};

export interface Custo {
    id: string;
    project_name: string;
    description?: string;
    estimated_amount?: number;
    actual_amount?: number;
    status: StatusCusto;
    start_date?: string;
    end_date?: string;
    created_by?: string;
    created_at: string;
    updated_at: string;
}

export interface CustoForm {
    project_name: string;
    description?: string;
    estimated_amount?: number;
    actual_amount?: number;
    status: StatusCusto;
    start_date?: string;
    end_date?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const MESES = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
];

/** Converte mes+ano para o formato DATE do banco: '2025-03-01' */
export function toReferenceMonth(mes: number, ano: number): string {
    return `${ano}-${String(mes).padStart(2, '0')}-01`;
}

/** Extrai mes e ano de um reference_month: '2025-03-01' */
export function fromReferenceMonth(ref: string): { mes: number; ano: number } {
    const d = new Date(ref);
    return { mes: d.getUTCMonth() + 1, ano: d.getUTCFullYear() };
}
