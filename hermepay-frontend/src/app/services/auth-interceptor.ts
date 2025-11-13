import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth'; // Importa nosso AuthService

/**
 * Intercepta todas as chamadas HTTP e adiciona o Token JWT
 * se o usuário estiver logado.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken(); // Pega o token salvo

  // Se o usuário tem um token
  if (token) {
    // Clona a requisição original e adiciona o novo cabeçalho de Autorização
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // O formato padrão de envio de JWT
      }
    });

    // Envia a requisição *clonada* (com o token)
    return next(clonedReq);
  }

  // Se não tem token, apenas envia a requisição original (ex: para /login)
  return next(req);
};