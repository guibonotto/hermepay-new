import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service'; // Importa o ApiService

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class InicioComponent implements OnInit {

  stats: any = null; // Variável para guardar as estatísticas
  isLoading = true;
  error: string | null = null;

  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.apiService.getTransactionStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        console.log('Estatísticas carregadas:', data);
      },
      error: (err) => {
        this.error = 'Falha ao carregar estatísticas.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}