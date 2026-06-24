import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CatalogoService } from '../../../services/catalogo.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { Producto } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css',
})
export class DetalleProducto implements OnInit {
  private route = inject(ActivatedRoute);
  private catalogoService = inject(CatalogoService);
  private carritoService = inject(CarritoService);
  private cdr = inject(ChangeDetectorRef);

  producto?: Producto;
  errorMensaje: string = '';
  cargando: boolean = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cargarDetalle(id);
      }
    });
  }

  private cargarDetalle(id: string): void {
    this.cargando = true;
    this.catalogoService.getProductoPorId(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.errorMensaje = 'El producto solicitado no está disponible.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  agregarAlCarrito(): void {
    if (this.producto) {
      this.carritoService.agregar(this.producto);
    }
  }
}