import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para el buscador
import { CatalogoService, Categoria } from '../../../services/catalogo.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido } from '../../../core/models/pedidos.models';

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importar FormsModule
  templateUrl: './historial-ventas.html',
  styleUrl: './historial-ventas.css',
})
export class HistorialVentas implements OnInit {

  private catalogoService = inject(CatalogoService);
  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);
  
  categorias: Categoria[] = [];
  pedidos: Pedido[] = [];
  
  // Variables para el buscador
  terminoBusqueda: string = '';
  
  // Variables para el detalle del modal
  pedidoSeleccionado?: Pedido;
  mostrarModal = false;

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarPedidos();
  }

  // Getter reactivo para filtrar pedidos
  get pedidosFiltrados(): Pedido[] {
    const termino = this.terminoBusqueda.toLowerCase();
    return this.pedidos.filter(p => 
      p.id.toString().includes(termino) || 
      p.cajero.toLowerCase().includes(termino)
    );
  }

  cargarCategorias(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al poblar categorías:', err)
    });
  }

  cargarPedidos(): void {
    this.pedidoService.listarPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar el historial:', err)
    });
  }

  verDetalle(id: number): void {
    this.pedidoService.obtenerPedido(id).subscribe({
      next: (data) => {
        this.pedidoSeleccionado = data;
        this.mostrarModal = true;
        this.cdr.detectChanges();
      },
      error: (err) => alert('No se pudo cargar el detalle del pedido.')
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.pedidoSeleccionado = undefined;
  }
}