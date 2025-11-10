import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service'; // Importa o ApiService

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transacoes.html',
  styleUrl: './transacoes.css'
})
export class TransacoesComponent implements OnInit {

  transactions: any[] = []; // Array para guardar as transações
  isLoading = true;
  error: string | null = null;

  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.apiService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.isLoading = false;
        console.log('Transações carregadas:', data);
      },
      error: (err) => {
        this.error = 'Falha ao carregar transações.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}