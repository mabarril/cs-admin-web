// =====================================================
// MODELOS DO MÓDULO DE CADASTROS
// =====================================================

// --- Unidade ---
export interface Unidade {
    id: string;
    name: string;
    description?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export type UnidadeForm = Pick<Unidade, 'name' | 'description'>;

// --- Classe ---
export interface Classe {
    id: string;
    name: string;
    color_hex: string;
    order_index: number;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export type ClasseForm = Pick<Classe, 'name' | 'color_hex' | 'order_index'>;

// --- Desbravador ---
export type Genero = 'male' | 'female';

export interface Desbravador {
    id: string;
    user_code?: string;
    full_name: string;
    position?: string;
    birth_date: string;
    gender?: Genero;
    unit_id?: string;
    class_id?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    // Joins (opcionais, quando carregados com select)
    unit?: Pick<Unidade, 'id' | 'name'>;
    class?: Pick<Classe, 'id' | 'name' | 'color_hex'>;
}

export type DesbravadorForm = Pick<
    Desbravador,
    'full_name' | 'birth_date' | 'gender' | 'position' | 'user_code' | 'unit_id' | 'class_id'
>;

export const GENERO_LABELS: Record<Genero, string> = {
    male: 'Masculino',
    female: 'Feminino',
};
