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
  private bffUrl = 'http://localhost:3000/api'; // Usaremos /api como prefixo

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
  // Futuramente, adicionaremos métodos para lojas, transações, etc.
  // ex: getStores(): Observable<any> { ... }
  // ex: createStore(data: any): Observable<any> { ... }
}