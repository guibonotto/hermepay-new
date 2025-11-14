import { inject, isDevMode } from '@angular/core'; // 1. IMPORTAMOS O isDevMode
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, BehaviorSubject } from 'rxjs';

// ==========================================================
// 1. O CÓDIGO DO AuthService
// ==========================================================
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // 2. CORRIGIMOS A URL PARA SER DINÂMICA
  private apiUrl = isDevMode()
    ? 'http://localhost:8080/api/auth' // URL de Desenvolvimento (local)
    : 'https://hermepay-gateway-app-dhhnbwg8cgh3ajhu.brazilsouth-01.azurewebsites.net/api/auth'; // URL de Produção (Nuvem)

  private readonly TOKEN_KEY = 'hermepay_token';
  private authStatus = new BehaviorSubject<boolean>(!!this.getToken());

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }
  
  /**
  * Registra um novo usuário.
  * @param userData - Objeto com name, email e password.
  */
  register(userData: any): Observable<any> {
    // Chama o endpoint de registro do BFF
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.authStatus.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }
}

// ==========================================================
// 2. O CÓDIGO DO authGuard
// ==========================================================
export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService); // Pega o serviço (acima)
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // SIM, pode acessar
  }

  console.log('AuthGuard: Bloqueado! Redirecionando para /login');
  router.navigate(['/login']);
  return false; // NÃO, não pode acessar
};