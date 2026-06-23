import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../core/services/carrito.service';
import { PedidoService } from '../../../core/services/pedido.service';

@Component({
  selector: 'app-checkout',
  imports: [DecimalPipe, RouterLink, FormsModule],
  templateUrl: './checkout.html',
})
export class Checkout {
  readonly carrito = inject(CarritoService);
  private readonly pedidoService = inject(PedidoService);


  nombre = '';
  telefono = '';
  tipoEntrega = 'LLEVAR';

  readonly procesando = signal(false);
  readonly error = signal<string | null>(null);
  readonly mostrarModal = signal(false);

  readonly pedidoId = signal<number | null>(null);
  readonly pedidoTotal = signal(0);

  readonly carritoVacio = computed(() => this.carrito.items().length === 0);

  procesarPedido(): void {
    if (this.carritoVacio()) {
      this.error.set('Tu carrito está vacío.');
      return;
    }
    this.procesando.set(true);
    this.error.set(null);


    const cajero = this.nombre.trim() || 'Cliente Web';
    const request = this.carrito.toPedidoRequest(cajero, this.tipoEntrega);

    this.pedidoService.crearPedido(request).subscribe({
      next: (pedido) => {
        this.procesando.set(false);
        this.pedidoId.set(pedido.id);
        this.pedidoTotal.set(pedido.total);
        this.carrito.vaciar();
        this.mostrarModal.set(true);
      },
      error: (err) => {
        this.procesando.set(false);
        this.error.set(
          err?.error?.mensaje ??
          'No se pudo procesar el pedido. Es posible que no haya un turno de caja abierto.'
        );
      },
    });
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
  }

  etiquetaEntrega(): string {
    switch (this.tipoEntrega) {
      case 'LOCAL': return 'Consumo local';
      case 'MESA': return 'Entrega en mesa';
      default: return 'Para llevar';
    }
  }
}
