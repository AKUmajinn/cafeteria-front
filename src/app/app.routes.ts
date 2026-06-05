import { Routes } from '@angular/router';
import { ClienteLayout } from './layouts/cliente-layout/cliente-layout';
import { EmpleadoLayout } from './layouts/empleado-layout/empleado-layout';

export const routes: Routes = [
  {
    path: 'clientes',
    component: ClienteLayout,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { 
        path: 'inicio', 
        loadComponent: () => import('./pages/clientes/inicio/inicio').then(m => m.Inicio) 
      },
      { 
        path: 'catalogo', 
        loadComponent: () => import('./pages/clientes/catalogo/catalogo').then(m => m.Catalogo) 
      },
      { 
        path: 'producto/:id', 
        loadComponent: () => import('./pages/clientes/detalle-producto/detalle-producto').then(m => m.DetalleProducto) 
      },
      { 
        path: 'carrito', 
        loadComponent: () => import('./pages/clientes/carrito/carrito').then(m => m.Carrito) 
      },
      { 
        path: 'checkout', 
        loadComponent: () => import('./pages/clientes/checkout/checkout').then(m => m.Checkout) 
      }
    ]
  },
  {
    path: 'empleados',
    component: EmpleadoLayout,
    children: [
      { path: '', redirectTo: 'pos', pathMatch: 'full' },
      { 
        path: 'pos', 
        loadComponent: () => import('./pages/empleados/pos/pos').then(m => m.Pos) 
      },
      { 
        path: 'catalogo', 
        loadComponent: () => import('./pages/empleados/admin-catalogo/admin-catalogo').then(m => m.AdminCatalogo) 
      },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/empleados/dashboard/dashboard').then(m => m.Dashboard) 
      },
      { 
        path: 'historial', 
        loadComponent: () => import('./pages/empleados/historial-ventas/historial-ventas').then(m => m.HistorialVentas) 
      }
    ]
  },
  { path: '', redirectTo: 'clientes/inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'clientes/inicio' }
];