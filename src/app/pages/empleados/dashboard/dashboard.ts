import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../../core/services/pedido.service';
import { ResumenTurnoResponse } from '../../../core/models/pedidos.models';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private readonly pedidoService = inject(PedidoService);

  // Estado del turno activo (null = no hay turno abierto)
  readonly turno = signal<ResumenTurnoResponse | null>(null);
  readonly cargando = signal(true);
  readonly procesando = signal(false); // mientras se abre/cierra
  readonly mensaje = signal<string | null>(null);

  // Nombre del cajero para la apertura (enlazado con ngModel en el HTML)
  cajero = '';

  readonly hayTurnoActivo = computed(() => this.turno() !== null);

  constructor() {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.cargando.set(true);
    this.mensaje.set(null);
    this.pedidoService.obtenerResumenTurnoActivo().subscribe({
      next: (r) => {
        this.turno.set(r);
        this.cargando.set(false);
      },
      error: () => {
        // El backend lanza error cuando NO hay turno activo.
        // Lo tratamos como "no hay turno abierto", no como fallo del servidor.
        // (Cuando agregues @RestControllerAdvice en ms-pedidos, aquí podrás
        //  distinguir un 404/409 "sin turno" de un 500 real.)
        this.turno.set(null);
        this.cargando.set(false);
      },
    });
  }

  abrir(): void {
    const nombre = this.cajero.trim();
    if (!nombre) {
      this.mensaje.set('Ingresa el nombre del cajero para abrir el turno.');
      return;
    }
    this.procesando.set(true);
    this.mensaje.set(null);
    this.pedidoService.abrirTurno(nombre).subscribe({
      next: () => {
        this.procesando.set(false);
        this.cajero = '';
        this.cargarResumen();
      },
      error: (err) => {
        this.procesando.set(false);
        this.mensaje.set(this.extraerMensaje(err, 'No se pudo abrir el turno.'));
      },
    });
  }

  cerrar(): void {
    this.procesando.set(true);
    this.mensaje.set(null);
    this.pedidoService.cerrarTurno().subscribe({
      next: () => {
        this.procesando.set(false);
        this.cargarResumen();
      },
      error: (err) => {
        this.procesando.set(false);
        this.mensaje.set(this.extraerMensaje(err, 'No se pudo cerrar el turno.'));
      },
    });
  }

  private extraerMensaje(err: any, fallback: string): string {
    // err.error.mensaje existirá cuando el backend devuelva errores limpios.
    return err?.error?.mensaje ?? fallback;
  }
}
