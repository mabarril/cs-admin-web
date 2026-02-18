import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Mensalidade, MensalidadeForm, StatusMensalidade } from '../../../core/models/financeiro.model';

export interface FiltroMensalidade {
    mes?: number;
    ano?: number;
    status?: StatusMensalidade;
}

@Injectable({ providedIn: 'root' })
export class MensalidadeService {
    private supabase = inject(SupabaseService);

    listar(filtros?: FiltroMensalidade): Observable<Mensalidade[]> {
        return from((async () => {
            let query = (this.supabase as any).client
                .from('mensalidades')
                .select('*, desbravador:pathfinders(id, full_name, unit:units(name))')
                .eq('active', true)
                .order('ano', { ascending: false })
                .order('mes', { ascending: false });

            if (filtros?.mes) query = query.eq('mes', filtros.mes);
            if (filtros?.ano) query = query.eq('ano', filtros.ano);
            if (filtros?.status) query = query.eq('status', filtros.status);

            const { data, error } = await query;
            if (error) throw error;
            return data as Mensalidade[];
        })()).pipe(catchError(() => of([])));
    }

    criar(form: MensalidadeForm): Observable<Mensalidade | null> {
        return from((async () => {
            const { data, error } = await (this.supabase as any).client
                .from('mensalidades')
                .insert(form)
                .select('*, desbravador:pathfinders(id, full_name, unit:units(name))')
                .single();
            if (error) throw error;
            return data as Mensalidade;
        })()).pipe(catchError(() => of(null)));
    }

    atualizar(id: string, form: Partial<MensalidadeForm>): Observable<Mensalidade | null> {
        return from((async () => {
            const { data, error } = await (this.supabase as any).client
                .from('mensalidades')
                .update({ ...form, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select('*, desbravador:pathfinders(id, full_name, unit:units(name))')
                .single();
            if (error) throw error;
            return data as Mensalidade;
        })()).pipe(catchError(() => of(null)));
    }

    marcarPago(id: string): Observable<Mensalidade | null> {
        return this.atualizar(id, {
            status: 'pago',
            data_pagamento: new Date().toISOString().split('T')[0]
        });
    }

    excluir(id: string): Observable<boolean> {
        return from((async () => {
            const { error } = await (this.supabase as any).client
                .from('mensalidades')
                .update({ active: false, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error) throw error;
            return true;
        })()).pipe(catchError(() => of(false)));
    }

    /** Calcula status automaticamente baseado no mês/ano */
    calcularStatus(mes: number, ano: number): StatusMensalidade {
        const hoje = new Date();
        const vencimento = new Date(ano, mes - 1, 10); // dia 10 de cada mês
        if (vencimento < hoje) return 'atrasado';
        return 'pendente';
    }
}
