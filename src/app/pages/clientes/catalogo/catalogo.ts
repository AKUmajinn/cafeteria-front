import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogoService, Categoria } from '../../../services/catalogo.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { Producto } from '../../../core/models/catalogo.models';
import { PRODUCTOS_MOCK } from '../../../core/data/productos-mock';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  private catalogoService = inject(CatalogoService);
  readonly carrito = inject(CarritoService);

  // Categorías reales desde ms-catalogo (consumo del compañero; intacto).
  categorias: Categoria[] = [];

  // TEMPORAL: productos desde el mock mientras NO exista GET /api/catalogo/productos.
  // Mismo criterio que en la página POS. Cuando el compañero implemente el endpoint,
  // reemplazar por CatalogoService.listarProductos().
  readonly productos = signal<Producto[]>(PRODUCTOS_MOCK);

  ngOnInit(): void {
    // Recupera las categorías reales del microservicio de catálogo.
    this.catalogoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => console.error('Error al cargar categorías en el cliente:', err)
    });
  }

  // Agrega el producto al carrito (flujo de pedidos).
  agregar(producto: Producto): void {
    this.carrito.agregar(producto);
  }
}