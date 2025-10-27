import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Importa a configuração
import { AppComponent } from './app/app.component'; // Importa o componente principal

// Inicia a aplicação usando o AppComponent e a configuração appConfig
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));