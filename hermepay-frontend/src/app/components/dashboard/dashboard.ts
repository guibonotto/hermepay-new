import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para *ngIf, *ngFor
import { ApiService } from '../../services/api.service'; // Importa nosso serviço

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // Adiciona o CommonModule
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit { // Implementa OnInit
  
  // Nossas variáveis (movidas para cá)
  dashboardData: any = null;
  errorLoadingData: string | null = null;

  // Injeta o ApiService
  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.apiService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.errorLoadingData = null;
        console.log('Dados do Dashboard:', data);
      },
      error: (err) => {
        console.error('Erro ao buscar dashboard:', err);
        this.errorLoadingData = `Erro ao carregar dados: ${err.message}`;
        this.dashboardData = null;
      }
    });
  }
}