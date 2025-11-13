import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importe os módulos de Formulário Reativo
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-config-empresa',
  standalone: true,
  // Adicione ReactiveFormsModule
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './config-empresa.html',
  styleUrl: './config-empresa.css'
})
export class ConfigEmpresaComponent implements OnInit {

  companyForm: FormGroup;
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;

  // ID da loja (chumbado por enquanto)
  // TROQUE PELO SEU ID DE TESTE (o mesmo que usou em "Credenciais")
  private storeId = "68ff029ca0f57567caad6691"; 

  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  constructor() {
    this.companyForm = this.fb.group({
      razaoSocial: ['', [Validators.required, Validators.minLength(3)]],
      
      // Validação de CNPJ (Formato XX.XXX.XXX/XXXX-XX)
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)]],
      
      endereco: this.fb.group({
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: [''],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', [Validators.required, Validators.maxLength(2)]], // Ex: SP
        
        // Validação de CEP (Formato XXXXX-XXX)
        cep: ['', [Validators.required, Validators.pattern(/^\d{5}\-\d{3}$/)]]
      })
    });
  }

  ngOnInit(): void {
    this.loadCompanyData();
  }

  // 1. Carrega os dados da loja para preencher o formulário
  loadCompanyData(): void {
    this.isLoading = true;
    this.apiService.getStoreDetails(this.storeId).subscribe({
      next: (data) => {
        // 'patchValue' preenche o formulário com os dados vindos da API
        this.companyForm.patchValue(data); 
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar dados da empresa.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // 2. Salva as alterações
  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.error = 'Razão Social e CNPJ são obrigatórios.';
      return;
    }

    this.error = null;
    this.successMessage = null;

    this.apiService.updateStoreDetails(this.storeId, this.companyForm.value).subscribe({
      next: (updatedData) => {
        console.log('Empresa atualizada:', updatedData);
        this.successMessage = 'Dados da empresa salvos com sucesso!';
      },
      error: (err) => {
        this.error = 'Falha ao salvar dados.';
        console.error(err);
      }
    });
  }
}