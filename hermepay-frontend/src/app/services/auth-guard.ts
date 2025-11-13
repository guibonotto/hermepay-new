import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth'; // Importa nosso AuthService (auth.ts)

/**
 * Nosso Guardião de Rota.
 * Verifica se o usuário está logado antes de ativar a rota.
 */
export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService); // Pega o serviço de autenticação
  const router = inject(Router); // Pega o roteador

  // Verifica se o usuário está logado
  if (authService.isLoggedIn()) {
    return true; // SIM, pode acessar a rota
  }

  // NÃO ESTÁ LOGADO
  console.log('AuthGuard: Bloqueado! Redirecionando para /login');
  
  // Redireciona para a página de login
  router.navigate(['/login']);
  return false; // NÃO, não pode acessar a rota
};