// Modelos espejados de las entidades/DTOs de ms-pedidos
// Long de Java -> number | LocalDateTime -> string (ISO 8601)

// ---------- Requests (lo que el front ENVÍA) ----------

export interface DetalleRequest {
  productoId: string;        // UUID del producto en ms-catalogo (referencia lógica)
  nombreProducto: string;    // snapshot: nombre al momento de la venta
  cantidad: number;
  precioUnitario: number;    // snapshot: precio al momento de la venta
}

export interface PedidoRequest {
  cajero: string;
  tipo: string;              // ej. 'LOCAL' | 'LLEVAR'
  detalles: DetalleRequest[];
}

// ---------- Responses (lo que el front RECIBE) ----------

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
