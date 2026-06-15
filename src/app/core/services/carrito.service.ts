import { Injectable, computed, signal } from '@angular/core';
import { Producto } from '../models/catalogo.models';
import { DetalleRequest, PedidoRequest } from '../models/pedidos.models';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  /** Precio congelado al momento de agregar (snapshot, igual que en el backend) */
  precioUnitario: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly _items = signal<ItemCarrito[]>([]);

  // Estado de solo lectura para los componentes
  readonly items = this._items.asReadonly();
  readonly cantidadTotal = computed(() =>
    this._items().reduce((acc, i) => acc + i.cantidad, 0)
  );
  readonly total = computed(() =>
    this._items().reduce((acc, i) => acc + i.cantidad * i.precioUnitario, 0)
  );

  agregar(producto: Producto, cantidad = 1): void {
    this._items.update(items => {
      const existente = items.find(i => i.producto.id === producto.id);
      if (existente) {
        return items.map(i =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [...items, { producto, cantidad, precioUnitario: producto.precioBase }];
    });
  }

  cambiarCantidad(productoId: string, cantidad: number): void {
    if (cantidad <= 0) {
      this.quitar(productoId);
      return;
    }
    this._items.update(items =>
      items.map(i => (i.producto.id === productoId ? { ...i, cantidad } : i))
    );
  }

  quitar(productoId: string): void {
    this._items.update(items => items.filter(i => i.producto.id !== productoId));
  }

  vaciar(): void {
    this._items.set([]);
  }

  /** Convierte el carrito al contrato que espera POST /api/pedidos */
  toPedidoRequest(cajero: string, tipo: string): PedidoRequest {
    const detalles: DetalleRequest[] = this._items().map(i => ({
      productoId: i.producto.id,
      nombreProducto: i.producto.nombre, // snapshot
      cantidad: i.cantidad,
      precioUnitario: i.precioUnitario   // snapshot
    }));
    return { cajero, tipo, detalles };
  }
}
