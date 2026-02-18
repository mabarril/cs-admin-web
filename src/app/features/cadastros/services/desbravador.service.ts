import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Desbravador, DesbravadorForm } from '../../../core/models/cadastros.model';

@Injectable({ providedIn: 'root' })
export class DesbravadorService {
    private supabase = inject(SupabaseService);

    listar(): Observable<Desbravador[]> {
        return from(
            this.supabase.client
                .from('pathfinders')
                .select(`
                    *,
                    unit:units(id, name),
                    class:classes(id, name, color_hex)
                `)
                .eq('active', true)
                .order('full_name')
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return (data ?? []) as Desbravador[];
            }),
            catchError(err => { console.error('DesbravadorService.listar:', err); return of([]); })
        );
    }

    buscarPorId(id: string): Observable<Desbravador | null> {
        return from(
            this.supabase.client
                .from('pathfinders')
                .select(`*, unit:units(id, name), class:classes(id, name, color_hex)`)
                .eq('id', id)
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error) return null;
                return data as Desbravador;
            }),
            catchError(() => of(null))
        );
    }

    criar(form: DesbravadorForm): Observable<Desbravador | null> {
        return from(
            this.supabase.client.from('pathfinders').insert(form).select().single()
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data as Desbravador;
            }),
            catchError(err => { console.error('DesbravadorService.criar:', err); return of(null); })
        );
    }

    atualizar(id: string, form: DesbravadorForm): Observable<Desbravador | null> {
        return from(
            this.supabase.client.from('pathfinders').update(form).eq('id', id).select().single()
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data as Desbravador;
            }),
            catchError(err => { console.error('DesbravadorService.atualizar:', err); return of(null); })
        );
    }

    excluir(id: string): Observable<boolean> {
        return from(
            this.supabase.client.from('pathfinders').update({ active: false }).eq('id', id)
        ).pipe(
            map(({ error }) => !error),
            catchError(() => of(false))
        );
    }

    calcularIdade(birthDate: string): number {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    }
}
