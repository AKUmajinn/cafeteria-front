import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // <-- Importaciones de Angular nucleares
import { CommonModule } from '@angular/common'; // <-- Permite el uso de *ngFor en el HTML
import { CatalogoService, Categoria } from '../../../services/catalogo.service'; // <-- Importación del servicio y la interfaz

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule], // <-- Obligatorio para que funcione tu bucle de categorías en el HTML
  templateUrl: './historial-ventas.html',
  styleUrl: './historial-ventas.css',
})
export class HistorialVentas implements OnInit { // <-- Se añade la implementación explícita de OnInit

  private catalogoService = inject(CatalogoService);
  private cdr = inject(ChangeDetectorRef);
  
  categorias: Categoria[] = [];

  ngOnInit(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges(); // Fuerza a la vista a repintar el select con los datos reales
      },
      error: (err) => console.error('Error al poblar categorías en historial:', err)
    });
  }
}