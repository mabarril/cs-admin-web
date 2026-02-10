import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { AccessDeniedComponent } from './features/auth/access-denied/access-denied.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    // Redirect root to dashboard
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    // Public routes (no authentication required)
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'access-denied', component: AccessDeniedComponent },

    // Protected routes (authentication required)
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },

    // Cadastros module (admin and secretary only)
    {
        path: 'cadastros',
        canActivate: [authGuard, roleGuard(['admin', 'secretary'])],
        loadChildren: () => import('./features/cadastros/cadastros.routes').then(m => m.routes)
    },

    // Financeiro module (admin and treasury only)
    {
        path: 'financeiro',
        canActivate: [authGuard, roleGuard(['admin', 'treasury'])],
        loadChildren: () => import('./features/financeiro/financeiro.routes').then(m => m.routes)
    },

    // Administrativo module (admin, secretary, and board)
    {
        path: 'administrativo',
        canActivate: [authGuard, roleGuard(['admin', 'secretary', 'board'])],
        loadChildren: () => import('./features/administrativo/administrativo.routes').then(m => m.routes)
    },

    // Relatórios module (all authenticated users)
    {
        path: 'relatorios',
        canActivate: [authGuard],
        loadChildren: () => import('./features/relatorios/relatorios.routes').then(m => m.routes)
    },

    // Wildcard route - redirect to dashboard
    { path: '**', redirectTo: '/dashboard' }
];
