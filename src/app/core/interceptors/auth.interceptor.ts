import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

/**
 * HTTP Interceptor to add authentication token to requests
 * and handle authentication errors
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const supabase = inject(SupabaseService);
    const router = inject(Router);

    // Clone the request and add authorization header if token exists
    const session = supabase.client.auth.getSession();

    session.then(({ data }) => {
        if (data.session?.access_token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${data.session.access_token}`
                }
            });
        }
    });

    return next(req).pipe(
        catchError((error) => {
            // Handle 401 Unauthorized errors
            if (error.status === 401) {
                // Redirect to login page
                router.navigate(['/login']);
            }

            return throwError(() => error);
        })
    );
};
