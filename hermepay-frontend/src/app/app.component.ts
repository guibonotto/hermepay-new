// src/app/app.ts
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // Adicione RouterLink
import { CommonModule } from '@angular/common'; // Adicione CommonModule
import { AuthService } from './services/auth'; // Importe o AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule], // Adicione RouterLink e CommonModule
  templateUrl: './app.html', 
  styleUrl: './app.css'     
})
export class AppComponent {
  title = 'hermepay-frontend';
  
  // Injeta o serviço de autenticação
  authService = inject(AuthService);
}