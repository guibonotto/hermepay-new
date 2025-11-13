import { Component, inject } from '@angular/core'; // Adicione 'inject'
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth'; // 1. Importe o AuthService

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayoutComponent {

  // 2. Injete o AuthService
  private authService = inject(AuthService);

  // 3. Atualize a função de logout
  logout(): void {
    this.authService.logout(); // Chama o logout real do serviço
  }
}