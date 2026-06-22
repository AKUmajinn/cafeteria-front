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
  terminoBusqueda: string = '';
  readonly cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error(err)
    });

    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando.set(true);
    this.catalogoService.listarProductos().subscribe({
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

  buscar(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.cargarProductos();
      return;
    }
    
    this.cargando.set(true);
    this.catalogoService.buscarProductos(this.terminoBusqueda).subscribe({
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