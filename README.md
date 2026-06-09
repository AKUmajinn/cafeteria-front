# CafeteriaFront

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.12.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

---
---

# Cafetería Front - Documentación de Rutas

Este proyecto es una aplicación web para la gestión de una cafetería, dividida en dos secciones principales: **Clientes** (Autoservicio) y **Empleados** (Administración/POS).

---

## 1. Área de Clientes
Esta sección está diseñada para el autoservicio del cliente.

* **Ruta Base:** `/clientes`
* **Navegación:** Se accede a través del menú superior en la interfaz.

| Vista | Ruta Directa | Descripción |
| :--- | :--- | :--- |
| **Inicio** | `/clientes/inicio` | Pantalla de bienvenida y categorías principales. |
| **Catálogo** | `/clientes/catalogo` | Listado de productos disponibles con filtros. |
| **Detalle Producto**| `/clientes/producto/:id` | Opciones y personalización del producto. |
| **Carrito** | `/clientes/carrito` | Resumen de ítems seleccionados. |
| **Checkout** | `/clientes/checkout` | Selección de entrega, pago y confirmación. |

---

## 2. Área de Empleados
Esta sección está diseñada para la gestión interna, ventas y administración.

* **Ruta Base:** `/empleados`
* **Navegación:** Menú superior administrativo disponible al loguearse.

| Vista | Ruta Directa | Descripción |
| :--- | :--- | :--- |
| **POS (Pedidos)** | `/empleados/pos` | Interfaz de toma de pedidos rápida. |
| **Catálogo Admin** | `/empleados/catalogo` | Mantenimiento, edición y creación de productos. |
| **Dashboard/Turno**| `/empleados/dashboard` | Gestión de turnos, caja y resumen diario. |
| **Historial** | `/empleados/historial` | Registro detallado de ventas y tickets. |

---
