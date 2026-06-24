import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = { username: '', password: '', telefono: '', email: '' };

  onRegister() {
    if (!this.user.username || !this.user.password || !this.user.telefono || !this.user.email) {
      alert("Por favor completa todos los campos");
      return;
    }

    this.auth.register(this.user).subscribe({
      next: () => {
        alert("Usuario registrado correctamente");
        this.router.navigate(['/login']);
      },
      error: () => alert("Error al registrar el usuario, intenta de nuevo.")
    });
  }
}