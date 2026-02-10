/**
 * User roles available in the system
 */
export type UserRole = 'admin' | 'secretary' | 'treasury' | 'counselor' | 'board';

/**
 * User profile interface
 */
export interface UserProfile {
    id: string;
    full_name: string;
    role: UserRole;
    active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Role display names for UI
 */
export const ROLE_NAMES: Record<UserRole, string> = {
    admin: 'Administrador',
    secretary: 'Secretaria',
    treasury: 'Tesouraria',
    counselor: 'Conselheiro',
    board: 'Diretoria'
};

/**
 * Role permissions mapping
 */
export const ROLE_PERMISSIONS = {
    admin: ['*'], // Full access
    secretary: ['cadastros', 'administrativo'],
    treasury: ['financeiro'],
    counselor: ['relatorios', 'desbravadores'],
    board: ['relatorios', 'administrativo']
} as const;
