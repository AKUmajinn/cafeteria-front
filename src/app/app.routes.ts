import { Routes, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteLayout } from './layouts/cliente-layout/cliente-layout';
import { EmpleadoLayout } from './layouts/empleado-layout/empleado-layout';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';


const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');


  if (!token) {
    router.navigate(['/login']);
    return false;
  }


  if (role !== 'ROLE_ADMIN') {
    alert('Acceso denegado: No tienes permisos de administrador.');
    router.navigate(['/clientes/inicio']);
    return false;
  }

 
  return true;
};


const userGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return true;
  }
  inject(Router).navigate(['/']); 
  return false;
};

export const routes: Routes = [

  { path: '', component: WelcomeComponent, pathMatch: 'full' },


  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },


  {
    path: 'clientes',
    component: ClienteLayout,
    canActivate: [userGuard], 
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
    canActivate: [adminGuard],
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


  { path: '**', redirectTo: '' }
];