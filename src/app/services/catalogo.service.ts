import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemModificador {
  id: string;
  nombre: string;
  precioAdicional: number;
}

export interface GrupoModificador {
  id: string;
  nombre: string;
  esObligatorio: boolean;
  items: ItemModificador[];
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  estado: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precioBase: number;
  imagenUrl: string;
  estado: string;
  categoria: Categoria;
  gruposModificadores: GrupoModificador[];
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private apiUrl = 'http://localhost:8090/api/catalogo'; 

  constructor(private http: HttpClient) {}

  // Resuelve el error de 'getProductoPorId' y tipa la respuesta para eliminar el tipo 'any' implícito
  getProductoPorId(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  eliminarProducto(id: string): Observable<string> {
  // Configura responseType como 'text' para evitar que Angular falle al recibir un cuerpo vacío
  return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}