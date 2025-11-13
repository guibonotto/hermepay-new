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
        // AQUI ESTÁ O TRUQUE:
        // Vamos percorrer cada transação e converter o texto 'products_json'
        // em um array real 'products'
        this.transactions = data.map((tx: any) => {
          let parsedProducts = [];
          try {
            if (tx.products_json) {
              parsedProducts = JSON.parse(tx.products_json);
            }
          } catch (e) {
            console.error('Erro ao fazer parse dos produtos:', e);
          }

          return {
            ...tx, // Mantém os dados originais (id, valor, status...)
            products: parsedProducts // Adiciona o array pronto para uso
          };
        });

        this.isLoading = false;
        console.log('Transações processadas:', this.transactions);
      },
      error: (err) => {
        this.error = 'Falha ao carregar transações.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}