import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html', // Ou .component.html
  styleUrl: './login.css'    // Ou .component.css
})
export class LoginComponent {

}