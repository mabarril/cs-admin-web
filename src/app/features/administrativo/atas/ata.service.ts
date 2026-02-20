import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Ata } from '../administrativo.model';

@Injectable({ providedIn: 'root' })
export class AtaService {
    private supabase = inject(SupabaseService).client;

    async listar(): Promise<Ata[]> {
        const { data, error } = await this.supabase
            .from('minutes')
            .select('*')
            .order('meeting_date', { ascending: false });

        if (error) { console.error('[AtaService] listar:', error); throw error; }
        return data ?? [];
    }

    async criar(ata: Omit<Ata, 'id' | 'created_at' | 'updated_at'>): Promise<Ata> {
        const { data, error } = await this.supabase
            .from('minutes')
            .insert(ata)
            .select()
            .single();

        if (error) { console.error('[AtaService] criar:', error); throw error; }
        return data;
    }

    async atualizar(id: string, ata: Partial<Ata>): Promise<Ata> {
        const { data, error } = await this.supabase
            .from('minutes')
            .update({ ...ata, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) { console.error('[AtaService] atualizar:', error); throw error; }
        return data;
    }

    async excluir(id: string): Promise<void> {
        const { error } = await this.supabase.from('minutes').delete().eq('id', id);
        if (error) { console.error('[AtaService] excluir:', error); throw error; }
    }
}
