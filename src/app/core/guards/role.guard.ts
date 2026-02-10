import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user-profile.model';

/**
 * Guard factory to protect routes based on user roles
 * @param allowedRoles Array of roles that can access the route
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        // First check if user is authenticated
        if (!authService.isAuthenticated) {
            return router.createUrlTree(['/login'], {
                queryParams: { returnUrl: state.url }
            });
        }

        // Admin has access to everything
        if (authService.isAdmin) {
            return true;
        }

        // Check if user has any of the allowed roles
        if (authService.hasAnyRole(allowedRoles)) {
            return true;
        }

        // User doesn't have permission
        return router.createUrlTree(['/access-denied']);
    };
};
