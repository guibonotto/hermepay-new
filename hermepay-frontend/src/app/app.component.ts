// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Só precisa do RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Só precisa do RouterOutlet
  templateUrl: './app.html', // (ou .component.html)
  styleUrl: './app.css'     // (ou .component.css)
})
export class AppComponent {
  title = 'hermepay-frontend';
  // TODA a lógica de carregar dashboard foi REMOVIDA daqui.
}