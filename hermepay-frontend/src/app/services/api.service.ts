import { Injectable } from '@angular/core';
// 1. Importe o HttpClient
import { HttpClient } from '@angular/common/http';
// 2. Importe o 'Observable' para lidar com respostas assíncronas
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // 3. Defina a URL base do seu BFF
  private bffUrl = 'http://localhost:8080/api';

  // 4. Injete o HttpClient no construtor
  constructor(private http: HttpClient) { }

  // 5. Crie o método para buscar os dados do dashboard
  getDashboardData(): Observable<any> {
    // Faz uma requisição GET para http://localhost:3000/api/dashboard
    return this.http.get<any>(`${this.bffUrl}/dashboard`);
  }
  getTransactionStats(): Observable<any> {
  // Faz uma requisição GET para http://localhost:3000/api/transactions/stats
  return this.http.get<any>(`${this.bffUrl}/transactions/stats`);
}
getTransactions(): Observable<any[]> {
  // Faz uma requisição GET para http://localhost:3000/api/transactions
  return this.http.get<any[]>(`${this.bffUrl}/transactions`);
}
getBankAccounts(storeId: string): Observable<any[]> {
  // Chama GET /api/stores/{storeId}/accounts
  return this.http.get<any[]>(`${this.bffUrl}/stores/${storeId}/accounts`);
}

// Adiciona uma nova conta bancária para uma loja
addBankAccount(storeId: string, accountData: any): Observable<any> {
  // Chama POST /api/stores/{storeId}/accounts
  return this.http.post<any>(`${this.bffUrl}/stores/${storeId}/accounts`, accountData);
}
deleteBankAccount(storeId: string, accountId: string): Observable<any> {
  // Chama DELETE /api/stores/{storeId}/accounts/{accountId}
  return this.http.delete<any>(`${this.bffUrl}/stores/${storeId}/accounts/${accountId}`);
}
// Busca os detalhes de uma loja específica
getStoreDetails(storeId: string): Observable<any> {
  // Chama GET /api/stores/{storeId}
  return this.http.get<any>(`${this.bffUrl}/stores/${storeId}`);
}
updateStoreDetails(storeId: string, updates: any): Observable<any> {
  // Chama PUT /api/stores/{storeId}
  return this.http.put<any>(`${this.bffUrl}/stores/${storeId}`, updates);
}
// Busca os webhooks de uma loja específica
getWebhooks(storeId: string): Observable<any[]> {
  // Chama GET /api/stores/{storeId}/webhooks
  return this.http.get<any[]>(`${this.bffUrl}/stores/${storeId}/webhooks`);
}

// Adiciona um novo webhook para uma loja
addWebhook(storeId: string, webhookData: any): Observable<any> {
  // Chama POST /api/stores/{storeId}/webhooks
  return this.http.post<any>(`${this.bffUrl}/stores/${storeId}/webhooks`, webhookData);
}
getMyAccountInfo(): Observable<any> {
  // Chama GET /api/auth/me
  // O AuthInterceptor vai adicionar o token automaticamente
  return this.http.get<any>(`${this.bffUrl}/auth/me`);
}
  // Futuramente, adicionaremos métodos para lojas, transações, etc.
  // ex: getStores(): Observable<any> { ... }
  // ex: createStore(data: any): Observable<any> { ... }
}