import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Pedido,
  PedidoRequest,
  ResumenTurnoResponse,
  Turno
} from '../models/pedidos.models';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/pedidos`;

  crearPedido(request: PedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseUrl, request);
  }

  listarPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseUrl);
  }

  obtenerPedido(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.baseUrl}/${id}`);
  }

  actualizarEstadoPedido(id: number, estado: string): Observable<Pedido> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<Pedido>(`${this.baseUrl}/${id}/estado`, null, { params });
  }

  obtenerResumenTurnoActivo(): Observable<ResumenTurnoResponse> {
    return this.http.get<ResumenTurnoResponse>(`${this.baseUrl}/turno/activo`);
  }

  abrirTurno(cajero: string): Observable<Turno> {
    const params = new HttpParams().set('cajero', cajero);
    return this.http.post<Turno>(`${this.baseUrl}/turno/apertura`, null, { params });
  }

  cerrarTurno(): Observable<Turno> {
    return this.http.post<Turno>(`${this.baseUrl}/turno/cierre`, null);
  }
}