import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importe os módulos de Roteamento
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  // Adicione os módulos de Roteamento aqui
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css'
})
export class ConfiguracoesComponent {
}