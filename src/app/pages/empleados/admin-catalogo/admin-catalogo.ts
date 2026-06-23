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

  formularioProducto = {
    nombre: '',
    precioBase: null as number | null,
    descripcion: '',
    categoriaId: ''
  };
  productoEnEdicionId: string | null = null;
  guardando = false;

  formularioCategoria = {
    nombre: '',
    descripcion: ''
  };
  categoriaEnEdicionId: string | null = null;
  guardandoCategoria = false;

  mostrarFormProducto = true;
  mostrarFormCategoria = false;

  ngOnInit(): void {
    this.cargarCategorias();
    this.aplicarFiltros();
  }

  cargarCategorias(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error(err)
    });
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

  cargarParaEditar(producto: Producto): void {
    this.mostrarFormProducto = true; 
    this.productoEnEdicionId = producto.id;
    this.formularioProducto = {
      nombre: producto.nombre,
      precioBase: producto.precioBase,
      descripcion: producto.descripcion,
      categoriaId: producto.categoria.id
    };
  }

  cancelarEdicion(): void {
    this.productoEnEdicionId = null;
    this.formularioProducto = { nombre: '', precioBase: null, descripcion: '', categoriaId: '' };
  }

  guardarProducto(): void {
    if (!this.formularioProducto.nombre || !this.formularioProducto.precioBase || !this.formularioProducto.categoriaId) {
      alert('Por favor, completa los campos obligatorios: Nombre, Categoría y Precio.');
      return;
    }

    this.guardando = true;

    if (this.productoEnEdicionId) {
      this.catalogoService.actualizarProducto(this.productoEnEdicionId, this.formularioProducto).subscribe({
        next: () => {
          alert('Producto actualizado exitosamente.');
          this.cancelarEdicion();
          this.guardando = false;
          this.aplicarFiltros();
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar el producto.');
          this.guardando = false;
        }
      });
    } else {
      this.catalogoService.crearProducto(this.formularioProducto).subscribe({
        next: () => {
          alert('Producto creado exitosamente.');
          this.cancelarEdicion();
          this.guardando = false;
          this.aplicarFiltros();
        },
        error: (err) => {
          console.error(err);
          alert('Error al crear el producto.');
          this.guardando = false;
        }
      });
    }
  }

  eliminarProducto(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este producto del catálogo?')) {
      this.catalogoService.eliminarProducto(id).subscribe({
        next: () => {
          alert('Producto eliminado con éxito de forma lógica.');
          if (this.productoEnEdicionId === id) {
            this.cancelarEdicion();
          }
          this.aplicarFiltros();
        },
        error: (err) => {
          alert('Error al procesar la baja lógica.');
          console.error(err);
        }
      });
    }
  }

  cargarParaEditarCategoria(categoria: Categoria): void {
    this.mostrarFormCategoria = true;
    this.categoriaEnEdicionId = categoria.id;
    this.formularioCategoria = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || ''
    };
  }

  cancelarEdicionCategoria(): void {
    this.categoriaEnEdicionId = null;
    this.formularioCategoria = { nombre: '', descripcion: '' };
  }

  guardarCategoria(): void {
    if (!this.formularioCategoria.nombre) {
      alert('El nombre de la categoría es obligatorio.');
      return;
    }

    this.guardandoCategoria = true;

    if (this.categoriaEnEdicionId) {
      this.catalogoService.actualizarCategoria(this.categoriaEnEdicionId, this.formularioCategoria).subscribe({
        next: () => {
          alert('Categoría actualizada exitosamente.');
          this.cancelarEdicionCategoria();
          this.guardandoCategoria = false;
          this.cargarCategorias();
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar la categoría.');
          this.guardandoCategoria = false;
        }
      });
    } else {
      this.catalogoService.crearCategoria(this.formularioCategoria).subscribe({
        next: () => {
          alert('Categoría creada exitosamente.');
          this.cancelarEdicionCategoria();
          this.guardandoCategoria = false;
          this.cargarCategorias();
        },
        error: (err) => {
          console.error(err);
          alert('Error al crear la categoría.');
          this.guardandoCategoria = false;
        }
      });
    }
  }
}