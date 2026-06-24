import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../../core/services/pedido.service';
import { CatalogoService } from '../../../services/catalogo.service';
import { ResumenTurnoResponse } from '../../../core/models/pedidos.models';
import { Categoria } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly catalogoService = inject(CatalogoService);

  readonly turno = signal<ResumenTurnoResponse | null>(null);
  readonly categorias = signal<Categoria[]>([]);
  readonly cargando = signal(true);
  readonly procesando = signal(false);
  readonly mensaje = signal<string | null>(null);

  cajero = '';

  readonly hayTurnoActivo = computed(() => this.turno() !== null);

  ngOnInit(): void {
    this.cargarResumen();
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => this.categorias.set(data),
      error: (err) => console.error(err)
    });
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
    return err?.error?.mensaje ?? fallback;
  }

  obtenerIcono(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('caf') || n.includes('bebida')) return 'bi-cup-hot';
    if (n.includes('snack') || n.includes('comida')) return 'bi-bag-heart';
    if (n.includes('postre') || n.includes('dulce')) return 'bi-cake2';
    return 'bi-tag';
  }
}