export interface ItemModificador {
  id: string;
  nombre: string;
  precioAdicional: number;
}

export interface GrupoModificador {
  id: string;
  nombre: string;
  esObligatorio: boolean;
  items: ItemModificador[];
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface Producto {
  id: string;
  categoria: Categoria;
  nombre: string;
  descripcion: string;
  precioBase: number;
  imagenUrl: string;
  estado: 'ACTIVO' | 'INACTIVO';
  gruposModificadores: GrupoModificador[];
}
