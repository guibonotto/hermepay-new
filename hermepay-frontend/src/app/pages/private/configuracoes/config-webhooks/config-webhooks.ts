import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importe os módulos de Formulário Reativo
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-config-webhooks',
  standalone: true,
  // Adicione ReactiveFormsModule aos imports
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './config-webhooks.html',
  styleUrl: './config-webhooks.css'
})
export class ConfigWebhooksComponent implements OnInit {

  webhooks: any[] = []; // Lista de webhooks cadastrados
  webhookForm: FormGroup; // Nosso formulário
  isLoading = true;
  error: string | null = null;

  // ID da loja (chumbado por enquanto)
  // TROQUE PELO SEU ID DE TESTE (o mesmo que usou em "Credenciais")
  private storeId = "68ff029ca0f57567caad6691"; 

  private apiService = inject(ApiService);
  private fb = inject(FormBuilder); // Injeta o FormBuilder

  constructor() {
    // Inicializa o formulário com o campo 'url' e validação
    this.webhookForm = this.fb.group({
      // Adicionamos uma validação de Padrão (regex) para garantir que é uma URL válida
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  ngOnInit(): void {
    this.loadWebhooks();
  }

  // Função para carregar a lista de webhooks
  loadWebhooks(): void {
    this.isLoading = true;
    this.apiService.getWebhooks(this.storeId).subscribe({
      next: (data) => {
       this.webhooks = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar webhooks.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Função chamada ao enviar o formulário
  onSubmit(): void {
    if (this.webhookForm.invalid) {
      this.error = 'Por favor, insira uma URL válida (ex: https://...).';
      return;
    }

    this.error = null;

    // Chama o serviço de API para adicionar o webhook
    this.apiService.addWebhook(this.storeId, this.webhookForm.value).subscribe({
      next: (newWebhook) => {
        console.log('Webhook adicionado:', newWebhook);
        // Adiciona o novo webhook à lista local (para atualizar a tela)
        this.webhooks.push(newWebhook);
        this.webhookForm.reset(); // Limpa o formulário
      },
      error: (err) => {
        this.error = 'Falha ao adicionar webhook.';
        console.error(err);
      }
    });
  }

  // (Futuramente, podemos adicionar um onDeleteWebhook aqui)
}