import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Unidade, UnidadeForm } from '../../../core/models/cadastros.model';

@Injectable({ providedIn: 'root' })
export class UnidadeService {
    private supabase = inject(SupabaseService);

    listar(): Observable<Unidade[]> {
        return from(
            this.supabase.client
                .from('units')
                .select('*')
                .eq('active', true)
                .order('name')
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return (data ?? []) as Unidade[];
            }),
            catchError(err => { console.error('UnidadeService.listar:', err); return of([]); })
        );
    }

    buscarPorId(id: string): Observable<Unidade | null> {
        return from(
            this.supabase.client.from('units').select('*').eq('id', id).single()
        ).pipe(
            map(({ data, error }) => {
                if (error) return null;
                return data as Unidade;
            }),
            catchError(() => of(null))
        );
    }

    criar(form: UnidadeForm): Observable<Unidade | null> {
        return from(
            this.supabase.client.from('units').insert(form).select().single()
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data as Unidade;
            }),
            catchError(err => { console.error('UnidadeService.criar:', err); return of(null); })
        );
    }

    atualizar(id: string, form: UnidadeForm): Observable<Unidade | null> {
        return from(
            this.supabase.client.from('units').update(form).eq('id', id).select().single()
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data as Unidade;
            }),
            catchError(err => { console.error('UnidadeService.atualizar:', err); return of(null); })
        );
    }

    excluir(id: string): Observable<boolean> {
        return from(
            this.supabase.client.from('units').update({ active: false }).eq('id', id)
        ).pipe(
            map(({ error }) => !error),
            catchError(() => of(false))
        );
    }
}
