/**
 * Financeiro module models
 */

// ─── Mensalidades ────────────────────────────────────────────────────────────

export type StatusMensalidade = 'pendente' | 'pago' | 'atrasado';

export const STATUS_MENSALIDADE_LABELS: Record<StatusMensalidade, string> = {
    pendente: 'Pendente',
    pago: 'Pago',
    atrasado: 'Atrasado'
};

export interface Mensalidade {
    id: string;
    desbravador_id: string;
    mes: number;       // 1–12
    ano: number;
    valor: number;
    status: StatusMensalidade;
    data_pagamento?: string;
    observacao?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    // joined
    desbravador?: { id: string; full_name: string; unit?: { name: string } };
}

export interface MensalidadeForm {
    desbravador_id: string;
    mes: number;
    ano: number;
    valor: number;
    status: StatusMensalidade;
    data_pagamento?: string;
    observacao?: string;
}

// ─── Caixa ───────────────────────────────────────────────────────────────────

export type TipoLancamento = 'entrada' | 'saida';

export const TIPO_LANCAMENTO_LABELS: Record<TipoLancamento, string> = {
    entrada: 'Entrada',
    saida: 'Saída'
};

export interface LancamentoCaixa {
    id: string;
    tipo: TipoLancamento;
    descricao: string;
    valor: number;
    data: string;
    categoria?: string;
    referencia?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface LancamentoCaixaForm {
    tipo: TipoLancamento;
    descricao: string;
    valor: number;
    data: string;
    categoria?: string;
    referencia?: string;
}

// ─── Custos ──────────────────────────────────────────────────────────────────

export type PeriodicidadeCusto = 'mensal' | 'anual' | 'unico';

export const PERIODICIDADE_LABELS: Record<PeriodicidadeCusto, string> = {
    mensal: 'Mensal',
    anual: 'Anual',
    unico: 'Único'
};

export interface Custo {
    id: string;
    nome: string;
    valor: number;
    periodicidade: PeriodicidadeCusto;
    categoria?: string;
    descricao?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CustoForm {
    nome: string;
    valor: number;
    periodicidade: PeriodicidadeCusto;
    categoria?: string;
    descricao?: string;
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
