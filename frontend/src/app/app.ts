import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. Ensure this path is correct relative to this file
import { NavbarComponent } from './shared/navbar/navbar.component'; 
import { AlertComponent } from './shared/alert/alert.component'; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AlertComponent], // 2. NavbarComponent MUST be standalone
  templateUrl: './app.html',
  // 3. Fix: Use 'styleUrl' for a single string or 'styleUrls' for an array
  styleUrls: ['./app.css'] 
})
export class App {}
