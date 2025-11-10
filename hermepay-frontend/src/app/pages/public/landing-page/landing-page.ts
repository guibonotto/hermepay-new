import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.html', // (confirme o nome .html ou .component.html)
  styleUrl: './landing-page.css'    // (confirme o nome .css ou .component.css)
})
export class LandingPageComponent {
}