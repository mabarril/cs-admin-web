import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
            let query = this.supabase.client
                .from('monthly_fees')
                .select('*, pathfinder:pathfinders(id, full_name, unit:units(name))')
                .order('reference_month', { ascending: false });

            // Filtra por mês/ano via range de datas no reference_month
            if (filtros?.mes && filtros?.ano) {
                const mes = String(filtros.mes).padStart(2, '0');
                const inicio = `${filtros.ano}-${mes}-01`;
                const fimDate = new Date(filtros.ano, filtros.mes, 0); // último dia do mês
                const fim = `${filtros.ano}-${mes}-${fimDate.getDate()}`;
                query = query.gte('reference_month', inicio).lte('reference_month', fim);
            } else if (filtros?.ano) {
                query = query
                    .gte('reference_month', `${filtros.ano}-01-01`)
                    .lte('reference_month', `${filtros.ano}-12-31`);
            }

            if (filtros?.status) query = query.eq('status', filtros.status);

            const { data, error } = await query;
            if (error) {
                console.error('[MensalidadeService] listar error:', error);
                throw error;
            }
            return data as Mensalidade[];
        })()).pipe(catchError(err => { console.error(err); return of([]); }));
    }

    criar(form: MensalidadeForm): Observable<Mensalidade | null> {
        return from((async () => {
            const { data, error } = await this.supabase.client
                .from('monthly_fees')
                .insert(form)
                .select('*, pathfinder:pathfinders(id, full_name, unit:units(name))')
                .single();
            if (error) {
                console.error('[MensalidadeService] criar error:', error);
                throw error;
            }
            return data as Mensalidade;
        })()).pipe(catchError(err => { console.error(err); return of(null); }));
    }

    atualizar(id: string, form: Partial<MensalidadeForm>): Observable<Mensalidade | null> {
        return from((async () => {
            const { data, error } = await this.supabase.client
                .from('monthly_fees')
                .update({ ...form, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select('*, pathfinder:pathfinders(id, full_name, unit:units(name))')
                .single();
            if (error) {
                console.error('[MensalidadeService] atualizar error:', error);
                throw error;
            }
            return data as Mensalidade;
        })()).pipe(catchError(err => { console.error(err); return of(null); }));
    }

    marcarPago(id: string): Observable<Mensalidade | null> {
        return this.atualizar(id, {
            status: 'paid',
            payment_date: new Date().toISOString().split('T')[0]
        });
    }

    excluir(id: string): Observable<boolean> {
        return from((async () => {
            const { error } = await this.supabase.client
                .from('monthly_fees')
                .delete()
                .eq('id', id);
            if (error) {
                console.error('[MensalidadeService] excluir error:', error);
                throw error;
            }
            return true;
        })()).pipe(catchError(err => { console.error(err); return of(false); }));
    }
}
