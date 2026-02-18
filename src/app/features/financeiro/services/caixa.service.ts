import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
            let query = (this.supabase as any).client
                .from('lancamentos_caixa')
                .select('*')
                .eq('active', true)
                .order('data', { ascending: false });

            if (filtros?.tipo) query = query.eq('tipo', filtros.tipo);
            if (filtros?.dataInicio) query = query.gte('data', filtros.dataInicio);
            if (filtros?.dataFim) query = query.lte('data', filtros.dataFim);

            const { data, error } = await query;
            if (error) throw error;
            return data as LancamentoCaixa[];
        })()).pipe(catchError(() => of([])));
    }

    criar(form: LancamentoCaixaForm): Observable<LancamentoCaixa | null> {
        return from((async () => {
            const { data, error } = await (this.supabase as any).client
                .from('lancamentos_caixa')
                .insert(form)
                .select('*')
                .single();
            if (error) throw error;
            return data as LancamentoCaixa;
        })()).pipe(catchError(() => of(null)));
    }

    atualizar(id: string, form: Partial<LancamentoCaixaForm>): Observable<LancamentoCaixa | null> {
        return from((async () => {
            const { data, error } = await (this.supabase as any).client
                .from('lancamentos_caixa')
                .update({ ...form, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select('*')
                .single();
            if (error) throw error;
            return data as LancamentoCaixa;
        })()).pipe(catchError(() => of(null)));
    }

    excluir(id: string): Observable<boolean> {
        return from((async () => {
            const { error } = await (this.supabase as any).client
                .from('lancamentos_caixa')
                .update({ active: false, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error) throw error;
            return true;
        })()).pipe(catchError(() => of(false)));
    }

    calcularSaldo(lancamentos: LancamentoCaixa[]): number {
        return lancamentos.reduce((acc, l) => {
            return l.tipo === 'entrada' ? acc + l.valor : acc - l.valor;
        }, 0);
    }
}
