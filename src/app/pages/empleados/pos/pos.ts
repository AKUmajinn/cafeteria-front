import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../core/services/carrito.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { CatalogoService } from '../../../services/catalogo.service';
import { Producto, Categoria } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [DecimalPipe, FormsModule],
  templateUrl: './pos.html',
  styleUrl: './pos.css'
})
export class Pos implements OnInit {
  readonly carrito = inject(CarritoService);
  private readonly pedidoService = inject(PedidoService);
  private readonly catalogoService = inject(CatalogoService);

  readonly categorias = signal<Categoria[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);

  categoriaSeleccionada: string = '';
  terminoBusqueda: string = '';
  precioMax: number = 50;

  readonly procesando = signal(false);
  readonly mensaje = signal<string | null>(null);
  readonly mensajeEsError = signal(false);

  readonly carritoVacio = computed(() => this.carrito.items().length === 0);

  private readonly cajero = 'Marco';

  ngOnInit(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => this.categorias.set(data),
      error: (err) => console.error(err)
    });

    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.cargando.set(true);

    const filtros = {
      nombre: this.terminoBusqueda.trim() !== '' ? this.terminoBusqueda.trim() : undefined,
      categoriaId: this.categoriaSeleccionada !== '' ? this.categoriaSeleccionada : undefined,
      precioMax: this.precioMax
    };

    this.catalogoService.listarProductos(filtros).subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.cargando.set(false);
      }
    });
  }

  seleccionarCategoria(id: string): void {
    this.categoriaSeleccionada = id;
    this.aplicarFiltros();
  }

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