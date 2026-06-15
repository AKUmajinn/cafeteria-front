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

  // ---------- Pedidos ----------

  /** POST /api/pedidos — crear pedido (carrito/checkout y POS) */
  crearPedido(request: PedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseUrl, request);
  }

  /** GET /api/pedidos — historial de ventas */
  listarPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseUrl);
  }

  /** GET /api/pedidos/{id} — detalle de un pedido */
  obtenerPedido(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.baseUrl}/${id}`);
  }

  // ---------- Turnos ----------

  /** GET /api/pedidos/turno/activo — resumen del turno abierto (dashboard) */
  obtenerResumenTurnoActivo(): Observable<ResumenTurnoResponse> {
    return this.http.get<ResumenTurnoResponse>(`${this.baseUrl}/turno/activo`);
  }

  /** POST /api/pedidos/turno/apertura?cajero= — abrir turno */
  abrirTurno(cajero: string): Observable<Turno> {
    const params = new HttpParams().set('cajero', cajero);
    return this.http.post<Turno>(`${this.baseUrl}/turno/apertura`, null, { params });
  }

  /** POST /api/pedidos/turno/cierre — cerrar turno activo */
  cerrarTurno(): Observable<Turno> {
    return this.http.post<Turno>(`${this.baseUrl}/turno/cierre`, null);
  }
}
