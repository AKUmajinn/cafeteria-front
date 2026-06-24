import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = { username: '', password: '' };

  onLogin() {
    if (!this.user.username || !this.user.password) return;

    this.auth.login(this.user).subscribe({

next: (res: any) => {
  localStorage.setItem('token', res.token);
  localStorage.setItem('role', res.role);
  localStorage.setItem('username', this.user.username); 
  
  const route = res.role === 'ROLE_ADMIN' ? '/empleados' : '/clientes/inicio';
  this.router.navigate([route]);
},

      error: () => alert('Credenciales incorrectas o servidor no disponible.')
    });
  }
}