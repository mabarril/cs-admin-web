import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor centralizado para tratamento de erros HTTP.
 * Lida com erros 401 (não autorizado) e 403 (acesso negado) de forma global.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            switch (error.status) {
                case 401:
                    // Sessão expirada ou não autorizado - redireciona para login
                    console.warn('[ErrorInterceptor] Sessão expirada. Redirecionando para login.');
                    router.navigate(['/login'], {
                        queryParams: { returnUrl: router.url }
                    });
                    break;

                case 403:
                    // Acesso negado - redireciona para página de acesso negado
                    console.warn('[ErrorInterceptor] Acesso negado.');
                    router.navigate(['/access-denied']);
                    break;

                case 0:
                    // Sem conexão com o servidor
                    console.error('[ErrorInterceptor] Sem conexão com o servidor.');
                    break;

                default:
                    // Outros erros são logados e repassados para o componente tratar
                    console.error(`[ErrorInterceptor] Erro HTTP ${error.status}:`, error.message);
            }

            return throwError(() => error);
        })
    );
};
