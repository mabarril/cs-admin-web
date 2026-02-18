import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private supabase = inject(SupabaseService);

    /**
     * Carrega o perfil de um usuário pelo ID
     */
    getProfile(userId: string): Observable<UserProfile | null> {
        return from(
            this.supabase.client
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error || !data) {
                    console.error('Erro ao carregar perfil:', error?.message);
                    return null;
                }
                return data as UserProfile;
            }),
            catchError(err => {
                console.error('Erro inesperado ao carregar perfil:', err);
                return of(null);
            })
        );
    }

    /**
     * Atualiza o nome completo do perfil do usuário
     */
    updateProfile(userId: string, updates: Partial<Pick<UserProfile, 'full_name'>>): Observable<UserProfile | null> {
        return from(
            this.supabase.client
                .from('user_profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error || !data) {
                    console.error('Erro ao atualizar perfil:', error?.message);
                    return null;
                }
                return data as UserProfile;
            }),
            catchError(err => {
                console.error('Erro inesperado ao atualizar perfil:', err);
                return of(null);
            })
        );
    }

    /**
     * Lista todos os perfis de usuário (apenas para admin)
     */
    listProfiles(): Observable<UserProfile[]> {
        return from(
            this.supabase.client
                .from('user_profiles')
                .select('*')
                .order('full_name')
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    console.error('Erro ao listar perfis:', error?.message);
                    return [];
                }
                return (data ?? []) as UserProfile[];
            }),
            catchError(err => {
                console.error('Erro inesperado ao listar perfis:', err);
                return of([]);
            })
        );
    }
}
