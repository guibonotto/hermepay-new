import { Component, OnInit, inject } from '@angular/core'; // 1. Importe OnInit e inject
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // 2. Importe CommonModule (para *ngIf, *ngFor)

// 3. Importe nosso serviço
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule], // 4. Adicione CommonModule aqui
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit { // 5. Implemente OnInit
  title = 'hermepay-frontend';
  dashboardData: any = null; // 6. Variável para guardar os dados
  errorLoadingData: string | null = null; // Para mostrar erros

  // 7. Injete o ApiService usando a função inject (forma moderna)
  private apiService = inject(ApiService);

  // 8. ngOnInit é chamado quando o componente carrega
  ngOnInit(): void {
    this.loadDashboard();
  }

  // 9. Método para carregar os dados
  loadDashboard(): void {
    this.apiService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data; // Guarda os dados se a chamada for sucesso
        this.errorLoadingData = null;
        console.log('Dados do Dashboard:', data); // Mostra no console do navegador
      },
      error: (err) => {
        console.error('Erro ao buscar dashboard:', err);
        this.errorLoadingData = `Erro ao carregar dados: ${err.message}`; // Guarda a mensagem de erro
        this.dashboardData = null;
      }
    });
  }
}