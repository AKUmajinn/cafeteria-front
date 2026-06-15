import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria, Producto } from '../models/catalogo.models';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/catalogo`;

  /** GET /api/catalogo/{id} — detalle de producto con modificadores */
  obtenerProducto(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  /** GET /api/catalogo/categorias — categorías activas para filtros */
  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`);
  }

  /** DELETE /api/catalogo/{id} — borrado lógico */
  eliminarProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ⚠️ PENDIENTE EN BACKEND: estos endpoints aún no existen en CatalogoController.
  // El front los necesita para las páginas catalogo, pos y admin-catalogo.

  /** GET /api/catalogo/productos?categoriaId= — listado de productos activos */
  listarProductos(categoriaId?: string): Observable<Producto[]> {
    let params = new HttpParams();
    if (categoriaId) {
      params = params.set('categoriaId', categoriaId);
    }
    return this.http.get<Producto[]>(`${this.baseUrl}/productos`, { params });
  }

  /** POST /api/catalogo/productos — crear producto (admin) */
  crearProducto(producto: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}/productos`, producto);
  }

  /** PUT /api/catalogo/productos/{id} — actualizar producto (admin) */
  actualizarProducto(id: string, producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/productos/${id}`, producto);
  }
}
