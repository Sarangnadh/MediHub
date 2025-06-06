import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, MatInputModule, MatCardModule, MatButtonModule, MatIconModule, MatOption, MatFormField, MatSelectModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private router: Router, private data: DataService) {
    this.loginForm = this.fb.group({
      role: ['user', Validators.required], // default role
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });


  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { role, email, password } = this.loginForm.value;

    if (role === 'admin') {
      this.data.loginAdmin(email, password).subscribe({
        next: (response) => {
          alert('Admin login successful!');
                    const admin = response.admin;
           localStorage.setItem('token',response.token);
          localStorage.setItem('adminId', admin._id);
          localStorage.setItem('name', admin.name);
          localStorage.setItem('email', admin.email);
          localStorage.setItem('role', 'admin');
          localStorage.setItem('isLoggedIn', 'true')
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          console.error('Admin login error:', err);
          alert('Invalid admin credentials!');
        }
      });
    } else {
      this.data.loginUser(email, password).subscribe({
        next: (response: any) => {
          alert('User login successful!');
          const user = response.user;
          // const token = response.token;

          localStorage.setItem('token',response.token);
          localStorage.setItem('userId', user._id);
          localStorage.setItem('name', user.name);
          localStorage.setItem('email', user.email);
          localStorage.setItem('role', 'user');
          localStorage.setItem('isLoggedIn', 'true');
          window.dispatchEvent(new Event('storage'));
          this.router.navigate(['/MyProfile']);
        },
        error: (err) => {
          console.error('User login error:', err);
          alert('Invalid user credentials!');
        }
      });
    }
  }

}
