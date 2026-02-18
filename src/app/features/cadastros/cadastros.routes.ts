import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'desbravadores',
        pathMatch: 'full'
    },
    {
        path: 'desbravadores',
        loadComponent: () =>
            import('./desbravadores/desbravadores.component').then(m => m.DesbravadoresComponent),
        title: 'Desbravadores'
    },
    {
        path: 'unidades',
        loadComponent: () =>
            import('./unidades/unidades.component').then(m => m.UnidadesComponent),
        title: 'Unidades'
    },
    {
        path: 'classes',
        loadComponent: () =>
            import('./classes/classes.component').then(m => m.ClassesComponent),
        title: 'Classes'
    }
];
