import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SupabaseService } from '../../../core/services/supabase.service';
import { LancamentoCaixa, LancamentoCaixaForm, TipoLancamento } from '../../../core/models/financeiro.model';

export interface FiltroLancamento {
    tipo?: TipoLancamento;
    dataInicio?: string;
    dataFim?: string;
}

@Injectable({ providedIn: 'root' })
export class CaixaService {
    private supabase = inject(SupabaseService);

    listar(filtros?: FiltroLancamento): Observable<LancamentoCaixa[]> {
        return from((async () => {
            let query = this.supabase.client
                .from('cash_transactions')
                .select('*, category:transaction_categories(name)')
                .order('transaction_date', { ascending: false });

            if (filtros?.tipo) query = query.eq('type', filtros.tipo);
            if (filtros?.dataInicio) query = query.gte('transaction_date', filtros.dataInicio);
            if (filtros?.dataFim) query = query.lte('transaction_date', filtros.dataFim);

            const { data, error } = await query;
            if (error) {
                console.error('[CaixaService] listar error:', error);
                throw error;
            }
            return data as LancamentoCaixa[];
        })()).pipe(catchError(err => { console.error(err); return of([]); }));
    }

    criar(form: LancamentoCaixaForm): Observable<LancamentoCaixa | null> {
        return from((async () => {
            const { data, error } = await this.supabase.client
                .from('cash_transactions')
                .insert(form)
                .select('*, category:transaction_categories(name)')
                .single();
            if (error) {
                console.error('[CaixaService] criar error:', error);
                throw error;
            }
            return data as LancamentoCaixa;
        })()).pipe(catchError(err => { console.error(err); return of(null); }));
    }

    atualizar(id: string, form: Partial<LancamentoCaixaForm>): Observable<LancamentoCaixa | null> {
        return from((async () => {
            const { data, error } = await this.supabase.client
                .from('cash_transactions')
                .update({ ...form, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select('*, category:transaction_categories(name)')
                .single();
            if (error) {
                console.error('[CaixaService] atualizar error:', error);
                throw error;
            }
            return data as LancamentoCaixa;
        })()).pipe(catchError(err => { console.error(err); return of(null); }));
    }

    excluir(id: string): Observable<boolean> {
        return from((async () => {
            const { error } = await this.supabase.client
                .from('cash_transactions')
                .delete()
                .eq('id', id);
            if (error) {
                console.error('[CaixaService] excluir error:', error);
                throw error;
            }
            return true;
        })()).pipe(catchError(err => { console.error(err); return of(false); }));
    }

    calcularSaldo(lancamentos: LancamentoCaixa[]): number {
        return lancamentos.reduce((acc, l) => {
            return l.type === 'income' ? acc + l.amount : acc - l.amount;
        }, 0);
    }
}
