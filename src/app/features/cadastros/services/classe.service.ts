import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Classe, ClasseForm } from '../../../core/models/cadastros.model';

@Injectable({ providedIn: 'root' })
export class ClasseService {
    private supabase = inject(SupabaseService);

    listar(): Observable<Classe[]> {
        return from(
            this.supabase.client
                .from('classes')
                .select('*')
                .eq('active', true)
                .order('order_index')
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return (data ?? []) as Classe[];
            }),
            catchError(err => { console.error('ClasseService.listar:', err); return of([]); })
        );
    }

    criar(form: ClasseForm): Observable<Classe | null> {
        return from(
            this.supabase.client.from('classes').insert(form).select().single()
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data as Classe;
            }),
            catchError(err => { console.error('ClasseService.criar:', err); return of(null); })
        );
    }

    atualizar(id: string, form: ClasseForm): Observable<Classe | null> {
        return from(
            this.supabase.client.from('classes').update(form).eq('id', id).select().single()
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data as Classe;
            }),
            catchError(err => { console.error('ClasseService.atualizar:', err); return of(null); })
        );
    }

    excluir(id: string): Observable<boolean> {
        return from(
            this.supabase.client.from('classes').update({ active: false }).eq('id', id)
        ).pipe(
            map(({ error }) => !error),
            catchError(() => of(false))
        );
    }
}
