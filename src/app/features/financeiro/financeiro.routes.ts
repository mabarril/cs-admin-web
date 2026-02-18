import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'mensalidades',
        pathMatch: 'full'
    },
    {
        path: 'mensalidades',
        loadComponent: () =>
            import('./mensalidades/mensalidades.component').then(m => m.MensalidadesComponent),
        title: 'Mensalidades'
    },
    {
        path: 'caixa',
        loadComponent: () =>
            import('./caixa/caixa.component').then(m => m.CaixaComponent),
        title: 'Caixa'
    },
    {
        path: 'custos',
        loadComponent: () =>
            import('./custos/custos.component').then(m => m.CustosComponent),
        title: 'Custos'
    }
];
