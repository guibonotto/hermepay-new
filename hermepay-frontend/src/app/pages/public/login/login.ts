import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importe os módulos de Formulário Reativo
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth'; // Importa nosso AuthService (auth.ts)

@Component({
  selector: 'app-login',
  standalone: true,
  // Adicione ReactiveFormsModule aos imports
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  loginForm: FormGroup; // Nosso formulário
  error: string | null = null; // Para mensagens de erro (ex: "Credenciais inválidas")
  
  // Injeta as ferramentas
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router); // Para redirecionar após o login

  constructor() {
    // Inicializa o formulário com os campos e validações
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Função chamada ao enviar o formulário
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.error = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.error = null; // Limpa erros antigos

    // Chama o serviço de autenticação
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Sucesso!
        console.log('Login bem-sucedido!', response.token);
        // Redireciona o usuário para o dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Falha no login (ex: 401 Credenciais inválidas)
        console.error('Erro no login:', err);
        if (err.status === 401) {
          this.error = 'E-mail ou senha inválidos.';
        } else {
          this.error = 'Erro ao tentar fazer login. Tente novamente.';
        }
      }
    });
  }
}