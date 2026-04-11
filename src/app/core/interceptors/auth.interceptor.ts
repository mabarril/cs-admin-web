import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, switchMap, catchError, throwError } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

/**
 * HTTP Interceptor to add authentication token to requests
 * and handle authentication errors
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const supabase = inject(SupabaseService);
    const router = inject(Router);

    // Converte a Promise do Supabase para um Observable do RxJS
    return from(supabase.client.auth.getSession()).pipe(
        switchMap(({ data }) => {
            // Se houver um token, adicionamos ao cabeçalho Authorization
            if (data.session?.access_token) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${data.session.access_token}`
                    }
                });
            }
            return next(req);
        }),
        catchError((error) => {
            // Se receber erro de Unauthorized, manda para login
            if (error.status === 401) {
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
