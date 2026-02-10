import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;
    private currentUser$ = new BehaviorSubject<User | null>(null);
    private currentSession$ = new BehaviorSubject<Session | null>(null);

    constructor() {
        this.supabase = createClient(
            environment.supabaseUrl,
            environment.supabaseAnonKey
        );

        // Inicializar sessão atual
        this.initializeSession();

        // Escutar mudanças de autenticação
        this.supabase.auth.onAuthStateChange((event, session) => {
            this.currentSession$.next(session);
            this.currentUser$.next(session?.user ?? null);
        });
    }

    /**
     * Inicializa a sessão do usuário
     */
    private async initializeSession(): Promise<void> {
        const { data: { session } } = await this.supabase.auth.getSession();
        this.currentSession$.next(session);
        this.currentUser$.next(session?.user ?? null);
    }

    /**
     * Retorna o cliente Supabase
     */
    get client(): SupabaseClient {
        return this.supabase;
    }

    /**
     * Retorna o módulo de autenticação
     */
    get auth() {
        return this.supabase.auth;
    }

    /**
     * Observable do usuário atual
     */
    get user$(): Observable<User | null> {
        return this.currentUser$.asObservable();
    }

    /**
     * Observable da sessão atual
     */
    get session$(): Observable<Session | null> {
        return this.currentSession$.asObservable();
    }

    /**
     * Retorna o usuário atual (snapshot)
     */
    get currentUser(): User | null {
        return this.currentUser$.value;
    }

    /**
     * Retorna a sessão atual (snapshot)
     */
    get currentSession(): Session | null {
        return this.currentSession$.value;
    }

    /**
     * Verifica se o usuário está autenticado
     */
    get isAuthenticated(): boolean {
        return !!this.currentUser$.value;
    }

    /**
     * Faz login com email e senha
     */
    async signIn(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    }

    /**
     * Faz logout
     */
    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
    }

    /**
     * Registra novo usuário
     */
    async signUp(email: string, password: string, metadata?: any) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });

        if (error) throw error;
        return data;
    }

    /**
     * Reseta a senha
     */
    async resetPassword(email: string) {
        const { data, error } = await this.supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return data;
    }

    /**
     * Atualiza a senha do usuário
     */
    async updatePassword(newPassword: string) {
        const { data, error } = await this.supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;
        return data;
    }

    /**
   * Helper para queries SELECT
   */
    from(table: string) {
        return this.supabase.from(table);
    }

    /**
   * Helper para RPC (Remote Procedure Call)
   */
    rpc(fn: string, params?: object) {
        return this.supabase.rpc(fn, params);
    }

    /**
     * Helper para Storage
     */
    get storage() {
        return this.supabase.storage;
    }
}
