import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoService, Categoria } from '../../../services/catalogo.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule], // <-- Permite usar *ngFor en pos.html
  templateUrl: './pos.html',
  styleUrl: './pos.css'
})
export class Pos implements OnInit {
  private catalogoService = inject(CatalogoService);
  private cdr = inject(ChangeDetectorRef);

  categorias: Categoria[] = [];

  ngOnInit(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar categorías en el POS:', err)
    });
  }
}