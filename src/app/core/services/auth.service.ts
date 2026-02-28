import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { ProfileService } from './profile.service';
import { UserProfile, UserRole } from '../models/user-profile.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase = inject(SupabaseService);
    private profileService = inject(ProfileService);
    private router = inject(Router);

    // --- State as Signals ---
    private _currentUserProfile = signal<UserProfile | null>(null);

    /** Perfil do usuário atual (somente leitura) */
    readonly currentUserProfile = this._currentUserProfile.asReadonly();

    /** Verdadeiro se o usuário está autenticado e ativo */
    readonly isAuthenticated = computed(() =>
        this._currentUserProfile() !== null && (this._currentUserProfile()?.active ?? false)
    );

    /** Role do usuário atual */
    readonly userRole = computed(() => this._currentUserProfile()?.role ?? null);

    /** Verdadeiro se o usuário é admin */
    readonly isAdmin = computed(() => this._currentUserProfile()?.role === 'admin');

    constructor() {
        this.initializeUserProfile();
    }

    /**
     * Inicializa o perfil do usuário a partir da sessão atual e escuta mudanças de auth.
     */
    private initializeUserProfile(): void {
        // Carrega o perfil para o usuário atual ao iniciar
        this.supabase.user$.subscribe(user => {
            if (!user) {
                this._currentUserProfile.set(null);
                return;
            }
            this.profileService.getProfile(user.id).subscribe(profile => {
                this._currentUserProfile.set(profile);
            });
        });
    }

    /**
     * Realiza o login com email e senha.
     */
    async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
        try {
            await this.supabase.signIn(email, password);
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao fazer login' };
        }
    }

    /**
     * Realiza o logout do usuário atual.
     */
    async signOut(): Promise<void> {
        await this.supabase.signOut();
        this._currentUserProfile.set(null);
        this.router.navigate(['/login']);
    }

    /**
     * Cria uma nova conta de usuário.
     */
    async signUp(email: string, password: string, fullName: string, role: UserRole): Promise<{ success: boolean; error?: string }> {
        try {
            await this.supabase.signUp(email, password, { full_name: fullName, role });
            return {
                success: true,
                error: 'Conta criada! Aguarde aprovação do administrador para acessar o sistema.'
            };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao criar conta' };
        }
    }

    /**
     * Solicita o reset de senha por email.
     */
    async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
        try {
            await this.supabase.resetPassword(email);
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao solicitar reset de senha' };
        }
    }

    /**
     * Atualiza a senha do usuário logado.
     */
    async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
        try {
            await this.supabase.updatePassword(newPassword);
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao atualizar senha' };
        }
    }

    /**
     * Verifica se o usuário possui um role específico.
     */
    hasRole(role: UserRole): boolean {
        return this._currentUserProfile()?.role === role;
    }

    /**
     * Verifica se o usuário possui qualquer um dos roles especificados.
     */
    hasAnyRole(roles: UserRole[]): boolean {
        const profile = this._currentUserProfile();
        if (!profile) return false;
        return roles.includes(profile.role);
    }
}
