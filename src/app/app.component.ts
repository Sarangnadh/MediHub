import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule, MatIconModule,CommonModule,MatButtonModule,MatCardModule,MatDialogModule,MatMenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'hospitalManagementSystem';
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  role = localStorage.getItem('role');
   constructor(private router:Router){
   }
     ngOnInit(): void {
    this.updateAuthState();

    // Listen for changes across tabs or components
    window.addEventListener('storage', () => this.updateAuthState());
  }

   updateAuthState() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.role = localStorage.getItem('role');
  }
   
  logout() {
    localStorage.clear();
       this.updateAuthState();
    this.isLoggedIn = false;
    this.router.navigateByUrl("home")
    alert("back to Home")
  }

  navigateToLogin() {
    this.router.navigateByUrl('login')
  }
}
