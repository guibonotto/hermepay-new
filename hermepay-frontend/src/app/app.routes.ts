import { Routes } from '@angular/router';

// Importação dos Componentes Públicos (SEM .component no path)
import { LandingPageComponent } from './pages/public/landing-page/landing-page';
import { LoginComponent } from './pages/public/login/login';
import { RegisterComponent } from './pages/public/register/register';

// Importação do Layout Privado (O "Casco") (SEM .component no path)
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout';

// Importação das Páginas Filhas (Abas do Dashboard) (SEM .component no path)
import { InicioComponent } from './pages/private/inicio/inicio';
import { TransacoesComponent } from './pages/private/transacoes/transacoes';
import { RecebimentosComponent } from './pages/private/recebimentos/recebimentos';
import { ConfiguracoesComponent } from './pages/private/configuracoes/configuracoes';


import { ConfigEmpresaComponent } from './pages/private/configuracoes/config-empresa/config-empresa';
import { ConfigTaxasComponent } from './pages/private/configuracoes/config-taxas/config-taxas';
import { ConfigUsuariosComponent } from './pages/private/configuracoes/config-usuarios/config-usuarios';
import { ConfigCredenciaisComponent } from './pages/private/configuracoes/config-credenciais/config-credenciais';
import { ConfigWebhooksComponent } from './pages/private/configuracoes/config-webhooks/config-webhooks';

export const routes: Routes = [
  
  // --- ROTAS PÚBLICAS ---
  { path: 'landing', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // --- ROTAS PRIVADAS / DO DASHBOARD ---
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'transacoes', component: TransacoesComponent },
      { path: 'recebimentos', component: RecebimentosComponent },
      { 
        path: 'configuracoes',
        component: ConfiguracoesComponent,
        children: [
          { path: '', redirectTo: 'empresa', pathMatch: 'full' },
          { path: 'empresa', component: ConfigEmpresaComponent },
          { path: 'taxas', component: ConfigTaxasComponent },
          { path: 'usuarios', component: ConfigUsuariosComponent },
          { path: 'credenciais', component: ConfigCredenciaisComponent },
          { path: 'webhooks', component: ConfigWebhooksComponent },
        ]
      },
    ]
  },

  // --- ROTA PADRÃO ---
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
];