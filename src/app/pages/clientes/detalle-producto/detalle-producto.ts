import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // <-- Añade ChangeDetectorRef aquí
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CatalogoService, Producto } from '../../../services/catalogo.service';

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
  private cdr = inject(ChangeDetectorRef); // <-- Inyecta el detector de cambios

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
        
        // ORDEN DE CONTROL: Fuerza a Angular a repintar el HTML de inmediato
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.errorMensaje = 'El producto solicitado no está disponible.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}