import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogoService, Categoria } from '../../../services/catalogo.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink], // <-- Obligatorios para que funcionen *ngFor y routerLink
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  private catalogoService = inject(CatalogoService);
  
  categorias: Categoria[] = [];

  ngOnInit(): void {
    // Recupera las categorías reales de tu microservicio
    this.catalogoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => console.error('Error al cargar categorías en el cliente:', err)
    });
  }
}