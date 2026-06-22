import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, Categoria } from '../core/models/catalogo.models';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private apiUrl = 'http://localhost:8090/api/catalogo'; 

  constructor(private http: HttpClient) {}

  getProductoPorId(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  listarProductos(filtros?: { nombre?: string, categoriaId?: string, precioMin?: number, precioMax?: number }): Observable<Producto[]> {
    let params = new HttpParams();
    
    if (filtros?.categoriaId) {
      params = params.set('categoriaId', filtros.categoriaId);
    }
    if (filtros?.nombre) {
      params = params.set('nombre', filtros.nombre);
    }
    if (filtros?.precioMin !== undefined && filtros?.precioMin !== null) {
      params = params.set('precioMin', filtros.precioMin.toString());
    }
    if (filtros?.precioMax !== undefined && filtros?.precioMax !== null) {
      params = params.set('precioMax', filtros.precioMax.toString());
    }

    return this.http.get<Producto[]>(`${this.apiUrl}/productos`, { params });
  }

  eliminarProducto(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}