import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Custo, CustoForm } from '../../../core/models/financeiro.model';

@Injectable({ providedIn: 'root' })
export class CustoService {
    private supabase = inject(SupabaseService);

    listar(): Observable<Custo[]> {
        return from((async () => {
            const { data, error } = await (this.supabase as any).client
                .from('custos')
                .select('*')
                .eq('active', true)
                .order('nome');
            if (error) throw error;
            return data as Custo[];
        })()).pipe(catchError(() => of([])));
    }

    criar(form: CustoForm): Observable<Custo | null> {
        return from((async () => {
            const { data, error } = await (this.supabase as any).client
                .from('custos')
                .insert(form)
                .select('*')
                .single();
            if (error) throw error;
            return data as Custo;
        })()).pipe(catchError(() => of(null)));
    }

    atualizar(id: string, form: Partial<CustoForm>): Observable<Custo | null> {
        return from((async () => {
            const { data, error } = await (this.supabase as any).client
                .from('custos')
                .update({ ...form, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select('*')
                .single();
            if (error) throw error;
            return data as Custo;
        })()).pipe(catchError(() => of(null)));
    }

    excluir(id: string): Observable<boolean> {
        return from((async () => {
            const { error } = await (this.supabase as any).client
                .from('custos')
                .update({ active: false, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error) throw error;
            return true;
        })()).pipe(catchError(() => of(false)));
    }

    calcularTotalMensal(custos: Custo[]): number {
        return custos.reduce((acc, c) => {
            if (c.periodicidade === 'mensal') return acc + c.valor;
            if (c.periodicidade === 'anual') return acc + c.valor / 12;
            return acc;
        }, 0);
    }
}
