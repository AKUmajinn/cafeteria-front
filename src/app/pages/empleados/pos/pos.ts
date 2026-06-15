import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CarritoService } from '../../../core/services/carrito.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { Producto } from '../../../core/models/catalogo.models';
import { PRODUCTOS_MOCK } from '../../../core/data/productos-mock';

@Component({
  selector: 'app-pos',
  imports: [DecimalPipe],
  templateUrl: './pos.html',
  styleUrl: './pos.css'
})
export class Pos {
  readonly carrito = inject(CarritoService);
  private readonly pedidoService = inject(PedidoService);

  // TEMPORAL: productos desde el mock. Cuando exista GET /productos,
  // reemplazar por una llamada a CatalogoService.listarProductos().
  readonly productos = signal<Producto[]>(PRODUCTOS_MOCK);

  readonly procesando = signal(false);
  readonly mensaje = signal<string | null>(null);
  readonly mensajeEsError = signal(false);

  readonly carritoVacio = computed(() => this.carrito.items().length === 0);

  // Cajero del turno. En un sistema con login saldría de la sesión;
  // por ahora lo dejamos fijo para probar.
  private readonly cajero = 'Marco';

  agregar(producto: Producto): void {
    this.carrito.agregar(producto);
  }

  procesarPedido(): void {
    if (this.carritoVacio()) {
      this.mostrarMensaje('El ticket está vacío.', true);
      return;
    }
    this.procesando.set(true);
    this.mensaje.set(null);

    const request = this.carrito.toPedidoRequest(this.cajero, 'LOCAL');
    this.pedidoService.crearPedido(request).subscribe({
      next: (pedido) => {
        this.procesando.set(false);
        this.carrito.vaciar();
        this.mostrarMensaje(
          `Pedido #${pedido.id} creado. Total: $${pedido.total.toFixed(2)}`,
          false
        );
      },
      error: (err) => {
        this.procesando.set(false);
        // Errores típicos del backend: sin turno activo, precio que no coincide.
        const txt = err?.error?.mensaje ?? 'No se pudo procesar el pedido. ¿Hay un turno abierto?';
        this.mostrarMensaje(txt, true);
      },
    });
  }

  private mostrarMensaje(texto: string, esError: boolean): void {
    this.mensaje.set(texto);
    this.mensajeEsError.set(esError);
  }
}
