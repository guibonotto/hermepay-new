import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-recebimentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recebimentos.html',
  styleUrl: './recebimentos.css'
})
export class RecebimentosComponent implements OnInit {
  
  bankAccounts: any[] = [];
  accountForm: FormGroup;
  isLoading = true;
  error: string | null = null;
  
  private storeId: string | null = null; 
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  // Lista de Bancos para o Select
  banksList = [
    { code: '001', name: 'Banco do Brasil' },
    { code: '237', name: 'Bradesco' },
    { code: '104', name: 'Caixa Econômica' },
    { code: '341', name: 'Itaú' },
    { code: '033', name: 'Santander' },
    { code: '260', name: 'Nubank' },
    { code: '077', name: 'Inter' },
    { code: '336', name: 'C6 Bank' },
    { code: '290', name: 'PagBank' }
  ];

  constructor() {
    this.accountForm = this.fb.group({
      ownerName: ['', [Validators.required, Validators.minLength(3)]],
      
      bankName: ['', Validators.required], // Agora será um Select
      
      // Validação: Exatamente 4 dígitos numéricos
      agency: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      
      // Validação: Números, um hífen obrigatório, e um dígito verificador (número ou letra)
      // Ex: 12345-6 ou 12345-X
      accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+-[0-9a-zA-Z]{1}$/)]],
      
      accountType: ['corrente', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  // ... (Mantenha as funções loadUserInfo e loadBankAccounts iguais) ...
  loadUserInfo(): void {
    this.apiService.getMyAccountInfo().subscribe({
      next: (user) => {
        if (user && user.store) {
          this.storeId = user.store;
          this.loadBankAccounts();
        } else {
          this.error = 'Erro: Usuário não possui uma loja vinculada.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.error = 'Falha ao carregar informações do usuário.';
        this.isLoading = false;
      }
    });
  }

  loadBankAccounts(): void {
    if (!this.storeId) return;
    this.isLoading = true;
    this.apiService.getBankAccounts(this.storeId).subscribe({
      next: (data) => {
        this.bankAccounts = data;
        this.isLoading = false;
      },
      error: (err) => this.isLoading = false
    });
  }

  onSubmit(): void {
    if (this.accountForm.invalid || !this.storeId) {
      // Marca todos como "tocados" para mostrar os erros vermelhos
      this.accountForm.markAllAsTouched();
      return;
    }

    this.apiService.addBankAccount(this.storeId, this.accountForm.value).subscribe({
     next: (newAccount) => {
  console.log('Conta salva com sucesso!');
  this.loadBankAccounts(); // <--- FORÇA O RECARREGAMENTO DA LISTA REAL
  this.accountForm.reset({ accountType: 'corrente' });
},
      error: (err) => {
        this.error = 'Falha ao adicionar conta.';
      }
    });
  }

  onDelete(accountId: string): void {
    if (!this.storeId || !confirm('Tem certeza que deseja deletar esta conta?')) return;

    this.apiService.deleteBankAccount(this.storeId, accountId).subscribe({
      next: () => {
        this.bankAccounts = this.bankAccounts.filter(acc => acc._id !== accountId);
      },
      error: (err) => console.error(err)
    });
  }
}