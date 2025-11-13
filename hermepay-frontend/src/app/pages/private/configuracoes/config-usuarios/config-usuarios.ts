import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service'; // Importa o ApiService

@Component({
  selector: 'app-config-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config-usuarios.html',
  styleUrl: './config-usuarios.css'
})
export class ConfigUsuariosComponent implements OnInit {

  currentUser: any = null; // Variável para guardar os dados do usuário
  isLoading = true;
  error: string | null = null;

  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.isLoading = true;
    this.apiService.getMyAccountInfo().subscribe({
      next: (data) => {
        this.currentUser = data;
        this.isLoading = false;
        console.log('Dados do usuário carregados:', data);
      },
      error: (err) => {
        // Se o token for inválido ou expirado (401), o AuthGuard deve tratar
        // mas colocamos uma mensagem de fallback aqui.
        this.error = 'Falha ao carregar dados do usuário.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Placeholder para o botão de deletar
  onDeleteAccount(): void {
    if (confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível.')) {
      console.log('TODO: Implementar delete de conta');
      this.error = 'Funcionalidade de deletar conta ainda não implementada.';
    }
  }
}