import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../../services/catalogo.service';
import { Categoria, Producto } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-admin-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './admin-catalogo.html',
  styleUrl: './admin-catalogo.css',
})
export class AdminCatalogo implements OnInit {
  private catalogoService = inject(CatalogoService);

  categorias: Categoria[] = [];
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal<boolean>(true);

  categoriaSeleccionada: string = '';
  terminoBusqueda: string = '';
  precioMax: number = 50;

  nuevoProducto = {
    nombre: '',
    precioBase: null as number | null,
    descripcion: '',
    categoriaId: ''
  };
  guardando = false;

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

  crearProducto(): void {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.precioBase || !this.nuevoProducto.categoriaId) {
      alert('Por favor, completa los campos obligatorios: Nombre, Categoría y Precio.');
      return;
    }

    this.guardando = true;
    this.catalogoService.crearProducto(this.nuevoProducto).subscribe({
      next: () => {
        alert('Producto creado exitosamente.');
        this.nuevoProducto = { nombre: '', precioBase: null, descripcion: '', categoriaId: '' };
        this.guardando = false;
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear el producto. Revisa la consola o verifica el backend.');
        this.guardando = false;
      }
    });
  }

  eliminarProducto(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este producto del catálogo?')) {
      this.catalogoService.eliminarProducto(id).subscribe({
        next: () => {
          alert('Producto eliminado con éxito de forma lógica.');
          this.aplicarFiltros();
        },
        error: (err) => {
          alert('Error al procesar la baja lógica.');
          console.error(err);
        }
      });
    }
  }
}