import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../../services/catalogo.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { Categoria, Producto } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [DecimalPipe, RouterLink, FormsModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  private catalogoService = inject(CatalogoService);
  readonly carrito = inject(CarritoService);

  categorias: Categoria[] = [];
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal<boolean>(true);

  categoriaSeleccionada: string = '';
  terminoBusqueda: string = '';
  precioMax: number = 50; 

  ngOnInit(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
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

  agregar(producto: Producto): void {
    this.carrito.agregar(producto);
  }
}