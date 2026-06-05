import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cliente-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './cliente-layout.html',
  styleUrl: './cliente-layout.css'
})
export class ClienteLayout {

}