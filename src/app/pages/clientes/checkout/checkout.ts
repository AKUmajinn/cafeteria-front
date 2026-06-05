import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './checkout.html'
})
export class Checkout {
  mostrarModal = false;

  procesarPedido() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}