import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseHost = environment.apiUrl.replace('/api', '');
  private readonly url = `${this.baseHost}/auth`; 

  login(user: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, user);
  }

  register(user: any): Observable<void> {
    return this.http.post<void>(`${this.url}/register`, user);
  }

  // NUEVOS MÉTODOS
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserName(): string | null {
    return localStorage.getItem('username');
  }

  logout(): void {
    localStorage.clear();
  }
}