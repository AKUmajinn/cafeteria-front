export interface DetalleRequest {
  productoId: string;        //
  nombreProducto: string;   
  cantidad: number;
  precioUnitario: number;    
}

export interface PedidoRequest {
  cajero: string;
  tipo: string;             
  detalles: DetalleRequest[];
}



export interface DetallePedido {
  id: number;
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Turno {
  id: number;
  fechaApertura: string;
  fechaCierre: string | null;
  cajeroApertura: string;
  estado: 'ACTIVO' | 'CERRADO';
  ventasTotales: number;
  ordenesCompletadas: number;
  ordenesCanceladas: number;
}

export interface Pedido {
  id: number;
  fecha: string;
  cajero: string;
  tipo: string;
  estado: string;
  total: number;
  turno?: Turno;
  detalles: DetallePedido[];
}

export interface ResumenTurnoResponse {
  turnoId: number;
  estado: string;
  cajero: string;
  ventasHoy: number;
  completadas: number;
  canceladas: number;
}
