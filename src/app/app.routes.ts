import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { AccessDeniedComponent } from './features/auth/access-denied/access-denied.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    // Redirect root to dashboard
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    // Public routes (no authentication required)
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'access-denied', component: AccessDeniedComponent },

    // Protected routes — all wrapped in MainLayoutComponent (sidebar + header)
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'cadastros',
                canActivate: [roleGuard(['admin', 'secretary'])],
                loadChildren: () =>
                    import('./features/cadastros/cadastros.routes').then(m => m.routes)
            },
            {
                path: 'financeiro',
                canActivate: [roleGuard(['admin', 'treasury'])],
                loadChildren: () =>
                    import('./features/financeiro/financeiro.routes').then(m => m.routes)
            },
            {
                path: 'administrativo',
                canActivate: [roleGuard(['admin', 'secretary', 'board'])],
                loadChildren: () =>
                    import('./features/administrativo/administrativo.routes').then(m => m.routes)
            },
            {
                path: 'relatorios',
                loadChildren: () =>
                    import('./features/relatorios/relatorios.routes').then(m => m.routes)
            }
        ]
    },

    // Wildcard route
    { path: '**', redirectTo: '/dashboard' }
];
