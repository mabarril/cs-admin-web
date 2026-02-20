import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Ato } from '../administrativo.model';

@Injectable({ providedIn: 'root' })
export class AtoService {
    private supabase = inject(SupabaseService).client;

    async listar(): Promise<Ato[]> {
        const { data, error } = await this.supabase
            .from('acts')
            .select('*')
            .order('act_date', { ascending: false });

        if (error) { console.error('[AtoService] listar:', error); throw error; }
        return data ?? [];
    }

    async criar(ato: Omit<Ato, 'id' | 'created_at' | 'updated_at'>): Promise<Ato> {
        const { data, error } = await this.supabase
            .from('acts')
            .insert(ato)
            .select()
            .single();

        if (error) { console.error('[AtoService] criar:', error); throw error; }
        return data;
    }

    async atualizar(id: string, ato: Partial<Ato>): Promise<Ato> {
        const { data, error } = await this.supabase
            .from('acts')
            .update({ ...ato, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) { console.error('[AtoService] atualizar:', error); throw error; }
        return data;
    }

    async excluir(id: string): Promise<void> {
        const { error } = await this.supabase.from('acts').delete().eq('id', id);
        if (error) { console.error('[AtoService] excluir:', error); throw error; }
    }
}
