import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../../../services/catalogo.service';
import { Categoria, Producto } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-admin-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-catalogo.html',
  styleUrl: './admin-catalogo.css',
})
export class AdminCatalogo implements OnInit {
  private catalogoService = inject(CatalogoService);
  private cdr = inject(ChangeDetectorRef);

  categorias: Categoria[] = [];
  productoTest?: Producto;
  errorMensaje: string = '';

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductoDePrueba();
  }

  cargarCategorias(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      }
    });
  }

  cargarProductoDePrueba(): void {
    this.catalogoService.getProductoPorId('f47ac10b-58cc-4372-a567-0e02b2c3d479').subscribe({
      next: (data) => {
        this.productoTest = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  eliminarProducto(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este producto del catálogo?')) {
      this.catalogoService.eliminarProducto(id).subscribe({
        next: () => {
          alert('Producto eliminado con éxito de forma lógica.');
          this.productoTest = undefined;
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          alert('Error al procesar la baja lógica.');
          console.error(err);
        }
      });
    }
  }
}