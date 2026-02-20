import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Autorizacao } from '../administrativo.model';

@Injectable({ providedIn: 'root' })
export class AutorizacaoService {
    private supabase = inject(SupabaseService).client;

    async listar(): Promise<Autorizacao[]> {
        const { data, error } = await this.supabase
            .from('exit_authorizations')
            .select(`
        *,
        pathfinders ( full_name )
      `)
            .order('event_date', { ascending: false });

        if (error) { console.error('[AutorizacaoService] listar:', error); throw error; }

        return (data ?? []).map((row: any) => ({
            ...row,
            pathfinder_name: row.pathfinders?.full_name ?? '',
            pathfinders: undefined,
        }));
    }

    async criar(auth: Omit<Autorizacao, 'id' | 'created_at' | 'updated_at' | 'pathfinder_name'>): Promise<Autorizacao> {
        const { data, error } = await this.supabase
            .from('exit_authorizations')
            .insert(auth)
            .select()
            .single();

        if (error) { console.error('[AutorizacaoService] criar:', error); throw error; }
        return data;
    }

    async atualizar(id: string, auth: Partial<Autorizacao>): Promise<Autorizacao> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { pathfinder_name, ...payload } = auth;
        const { data, error } = await this.supabase
            .from('exit_authorizations')
            .update({ ...payload, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) { console.error('[AutorizacaoService] atualizar:', error); throw error; }
        return data;
    }

    async excluir(id: string): Promise<void> {
        const { error } = await this.supabase.from('exit_authorizations').delete().eq('id', id);
        if (error) { console.error('[AutorizacaoService] excluir:', error); throw error; }
    }
}
