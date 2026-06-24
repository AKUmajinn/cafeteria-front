import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../../services/catalogo.service';
import { Categoria } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private catalogoService = inject(CatalogoService);
  readonly categorias = signal<Categoria[]>([]);

  ngOnInit(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => this.categorias.set(data),
      error: (err) => console.error(err)
    });
  }

  obtenerIcono(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('caf') || n.includes('bebida')) return 'bi-cup-hot';
    if (n.includes('snack') || n.includes('comida')) return 'bi-bag-heart';
    if (n.includes('postre') || n.includes('dulce')) return 'bi-cake2';
    return 'bi-star';
  }
}