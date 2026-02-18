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
            const { data, error } = await this.supabase.client
                .from('costs')
                .select('*')
                .order('project_name');
            if (error) {
                console.error('[CustoService] listar error:', error);
                throw error;
            }
            return data as Custo[];
        })()).pipe(catchError(err => { console.error(err); return of([]); }));
    }

    criar(form: CustoForm): Observable<Custo | null> {
        return from((async () => {
            const { data, error } = await this.supabase.client
                .from('costs')
                .insert(form)
                .select('*')
                .single();
            if (error) {
                console.error('[CustoService] criar error:', error);
                throw error;
            }
            return data as Custo;
        })()).pipe(catchError(err => { console.error(err); return of(null); }));
    }

    atualizar(id: string, form: Partial<CustoForm>): Observable<Custo | null> {
        return from((async () => {
            const { data, error } = await this.supabase.client
                .from('costs')
                .update({ ...form, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select('*')
                .single();
            if (error) {
                console.error('[CustoService] atualizar error:', error);
                throw error;
            }
            return data as Custo;
        })()).pipe(catchError(err => { console.error(err); return of(null); }));
    }

    excluir(id: string): Observable<boolean> {
        return from((async () => {
            const { error } = await this.supabase.client
                .from('costs')
                .delete()
                .eq('id', id);
            if (error) {
                console.error('[CustoService] excluir error:', error);
                throw error;
            }
            return true;
        })()).pipe(catchError(err => { console.error(err); return of(false); }));
    }
}
