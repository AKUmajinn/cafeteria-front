import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../../services/catalogo.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido } from '../../../core/models/pedidos.models';
import { Categoria } from '../../../core/models/catalogo.models';

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-ventas.html',
  styleUrl: './historial-ventas.css',
})
export class HistorialVentas implements OnInit {

  private catalogoService = inject(CatalogoService);
  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);
  
  categorias: Categoria[] = [];
  pedidos: Pedido[] = [];
  

  terminoBusqueda: string = '';
  filtroEstado: string = '';
  filtroFecha: string = '';
  filtroCajero: string = '';
  filtroTipo: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  
  pedidoSeleccionado?: Pedido;
  mostrarModal = false;

  ngOnInit(): void {
    this.cargarCategorias(); 
    this.cargarPedidos();
  }


  get cajerosUnicos(): string[] {
    const cajeros = this.pedidos.map(p => p.cajero);
    return [...new Set(cajeros)];
  }

  get pedidosFiltrados(): Pedido[] {
    let filtrados = this.pedidos;


    if (this.terminoBusqueda) {
      const termino = this.terminoBusqueda.toLowerCase();
      filtrados = filtrados.filter(p => 
        p.id.toString().includes(termino) || 
        p.cajero.toLowerCase().includes(termino)
      );
    }


    if (this.filtroEstado) {
      filtrados = filtrados.filter(p => p.estado === this.filtroEstado);
    }


    if (this.filtroFecha) {
      filtrados = filtrados.filter(p => {
        if (!p.fecha) return false;
        const fechaPedido = p.fecha.toString().substring(0, 10);
        return fechaPedido === this.filtroFecha;
      });
    }


    if (this.fechaInicio) {
      filtrados = filtrados.filter(p => {
        if (!p.fecha) return false;
        const fechaPedido = p.fecha.toString().substring(0, 10);
        return fechaPedido >= this.fechaInicio; 
      });
    }

    // Filtro "Hasta" (Fecha Fin)
    if (this.fechaFin) {
      filtrados = filtrados.filter(p => {
        if (!p.fecha) return false;
        const fechaPedido = p.fecha.toString().substring(0, 10);
        return fechaPedido <= this.fechaFin;
      });
    }

    if (this.filtroCajero) {
      filtrados = filtrados.filter(p => p.cajero === this.filtroCajero);
    }

    if (this.filtroTipo) {
      filtrados = filtrados.filter(p => {
        if (!p.tipo) return false;
        return p.tipo.toLowerCase() === this.filtroTipo.toLowerCase();
      });
    }

    return filtrados;
  }

  cargarCategorias(): void {
    this.catalogoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  cargarPedidos(): void {
    this.pedidoService.listarPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
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

  cambiarEstado(pedido: Pedido, nuevoEstado: string): void {
    const estadoAnterior = pedido.estado;
    pedido.estado = nuevoEstado; 
    
    this.pedidoService.actualizarEstadoPedido(pedido.id, nuevoEstado).subscribe({
      next: (pedidoActualizado) => {
        pedido.estado = pedidoActualizado.estado;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        pedido.estado = estadoAnterior; 
        alert('Ocurrió un error al intentar cambiar el estado del pedido.');
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.filtroEstado = '';
    this.filtroFecha = '';
    this.filtroCajero = '';
    this.filtroTipo = '';
  }
}