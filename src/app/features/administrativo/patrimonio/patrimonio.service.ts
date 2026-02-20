import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Asset } from '../administrativo.model';

@Injectable({ providedIn: 'root' })
export class PatrimonioService {
    private supabase = inject(SupabaseService).client;

    async listar(): Promise<Asset[]> {
        const { data, error } = await this.supabase
            .from('assets')
            .select('*')
            .order('name', { ascending: true });

        if (error) { console.error('[PatrimonioService] listar:', error); throw error; }
        return data ?? [];
    }

    async criar(asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>): Promise<Asset> {
        const { data, error } = await this.supabase
            .from('assets')
            .insert(asset)
            .select()
            .single();

        if (error) { console.error('[PatrimonioService] criar:', error); throw error; }
        return data;
    }

    async atualizar(id: string, asset: Partial<Asset>): Promise<Asset> {
        const { data, error } = await this.supabase
            .from('assets')
            .update({ ...asset, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) { console.error('[PatrimonioService] atualizar:', error); throw error; }
        return data;
    }

    async excluir(id: string): Promise<void> {
        const { error } = await this.supabase.from('assets').delete().eq('id', id);
        if (error) { console.error('[PatrimonioService] excluir:', error); throw error; }
    }
}
