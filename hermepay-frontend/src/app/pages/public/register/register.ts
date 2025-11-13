import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// 1. Adicione 'RouterLink' aqui na importação
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../../../services/auth'; 

@Component({
  selector: 'app-register',
  standalone: true,
  // 2. Adicione 'RouterLink' aqui na lista de imports do componente
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  registerForm: FormGroup;
  error: string | null = null;
  successMessage: string | null = null;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.error = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.error = null;
    this.successMessage = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido!', response);
        this.successMessage = 'Conta criada com sucesso! Redirecionando para o login...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        
      },
      error: (err) => {
        console.error('Erro no registro:', err);
        if (err.status === 400 && err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Erro ao tentar criar conta. Tente novamente.';
        }
      }
    });
  }
}