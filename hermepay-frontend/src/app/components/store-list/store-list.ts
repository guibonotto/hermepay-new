import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-list.html',
  styleUrl: './store-list.css'
})
export class StoreListComponent { // <-- Esta linha 'export' é a que corrige o erro

}