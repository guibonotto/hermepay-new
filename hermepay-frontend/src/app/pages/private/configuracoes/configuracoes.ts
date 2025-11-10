import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // <-- MUITO IMPORTANTE!

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // <-- MUITO IMPORTANTE!
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css'
})
export class ConfiguracoesComponent {
}