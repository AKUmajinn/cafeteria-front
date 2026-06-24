import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { CatalogoService, Categoria } from '../../../services/catalogo.service'; 

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './historial-ventas.html',
  styleUrl: './historial-ventas.css',
})
export class HistorialVentas implements OnInit { 

  private catalogoService = inject(CatalogoService);
  private cdr = inject(ChangeDetectorRef);
  
  categorias: Categoria[] = [];

  ngOnInit(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error al poblar categorías en historial:', err)
    });
  }
}