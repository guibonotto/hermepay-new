import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';

// 2. Importe nosso novo interceptor
import { authInterceptor } from './services/auth-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 2. Adicione o provider aqui
    provideHttpClient(
      withInterceptors([authInterceptor]) // Registra o interceptor
    ),
  ]
};