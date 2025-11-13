import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-config-credenciais',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config-credenciais.html',
  styleUrl: './config-credenciais.css'
})
export class ConfigCredenciaisComponent implements OnInit {

  storeData: any = null;
  isLoading = true;
  error: string | null = null;

  // ATENÇÃO: Verifique se este ID existe no seu MongoDB!
  private storeId = "68ff029ca0f57567caad6691"; // <-- TROQUE PELO SEU ID DE TESTE

  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.loadStoreData();
  }

  loadStoreData(): void {
    this.isLoading = true;
    this.apiService.getStoreDetails(this.storeId).subscribe({
      next: (data) => {
        this.storeData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar credenciais.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Função (placeholder) para o botão copiar
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  }
}