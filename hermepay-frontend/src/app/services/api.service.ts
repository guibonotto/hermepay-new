import { Injectable, isDevMode } from '@angular/core'; // 1. Importe isDevMode
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // 3. Definição da URL base (Inteligente)
  // Se estiver em desenvolvimento (localhost), usa a porta 8080 local.
  // Se estiver em produção (Azure), usa a URL do seu Gateway.
  private bffUrl = isDevMode()
    ? 'http://localhost:8080/api'
    : 'https://hermepay-gateway-app-dhhnbwg8cgh3ajhu.brazilsouth-01.azurewebsites.net/api';

  // 4. Injete o HttpClient no construtor
  constructor(private http: HttpClient) { }

  // 5. Métodos da API

  // Buscar dados do dashboard
  getDashboardData(): Observable<any> {
    return this.http.get<any>(`${this.bffUrl}/dashboard`);
  }

  // Buscar estatísticas de transações
  getTransactionStats(): Observable<any> {
    return this.http.get<any>(`${this.bffUrl}/transactions/stats`);
  }

  // Buscar lista de transações
  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.bffUrl}/transactions`);
  }

  // Buscar contas bancárias
  getBankAccounts(storeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.bffUrl}/stores/${storeId}/accounts`);
  }

  // Adicionar conta bancária
  addBankAccount(storeId: string, accountData: any): Observable<any> {
    return this.http.post<any>(`${this.bffUrl}/stores/${storeId}/accounts`, accountData);
  }

  // Deletar conta bancária
  deleteBankAccount(storeId: string, accountId: string): Observable<any> {
    return this.http.delete<any>(`${this.bffUrl}/stores/${storeId}/accounts/${accountId}`);
  }

  // Buscar detalhes da loja
  getStoreDetails(storeId: string): Observable<any> {
    return this.http.get<any>(`${this.bffUrl}/stores/${storeId}`);
  }

  // Atualizar loja
  updateStoreDetails(storeId: string, updates: any): Observable<any> {
    return this.http.put<any>(`${this.bffUrl}/stores/${storeId}`, updates);
  }

  // Buscar webhooks
  getWebhooks(storeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.bffUrl}/stores/${storeId}/webhooks`);
  }

  // Adicionar webhook
  addWebhook(storeId: string, webhookData: any): Observable<any> {
    return this.http.post<any>(`${this.bffUrl}/stores/${storeId}/webhooks`, webhookData);
  }

  // Buscar dados do usuário logado ("Me")
  getMyAccountInfo(): Observable<any> {
    return this.http.get<any>(`${this.bffUrl}/auth/me`);
  }
}