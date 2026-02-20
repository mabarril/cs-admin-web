import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./administrativo-shell.component').then(m => m.AdministrativoShellComponent),
        children: [
            { path: '', redirectTo: 'patrimonio', pathMatch: 'full' },
            {
                path: 'patrimonio',
                loadComponent: () =>
                    import('./patrimonio/patrimonio.component').then(m => m.PatrimonioComponent)
            },
            {
                path: 'atas',
                loadComponent: () =>
                    import('./atas/atas.component').then(m => m.AtasComponent)
            },
            {
                path: 'atos',
                loadComponent: () =>
                    import('./atos/atos.component').then(m => m.AtosComponent)
            },
            {
                path: 'autorizacoes',
                loadComponent: () =>
                    import('./autorizacoes/autorizacoes.component').then(m => m.AutorizacoesComponent)
            },
        ]
    }
];
