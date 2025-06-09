import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon,} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Admin } from '../../admin';
import { DataService } from '../../services/data.service';
import { User } from '../../user';

@Component({
  selector: 'app-register',
  imports: [CommonModule,RouterModule, ReactiveFormsModule, MatCard, MatCardModule, MatSelectModule, MatSelectModule, MatIcon, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isAdmin = false
  
  
  constructor(private fb: FormBuilder, private router: Router,private data:DataService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required], // default to 'user'
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      key: ['', [Validators.required]],

    }, {
      validators: this.passwordMatchValidator
    });
    this.registerForm.get('role')?.valueChanges.subscribe((role) => {
      this.isAdmin = role === 'admin';
      const keyControl = this.registerForm.get('key');
      if (this.isAdmin) {
        keyControl?.setValidators([Validators.required]);
      } else {
        keyControl?.clearValidators();
      }
      keyControl?.updateValueAndValidity();
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }
  
onSubmit() {
   if (this.registerForm.invalid) return;

    const { name, email, password, role, key } = this.registerForm.value;

    if (role === 'admin') {
    
      const adminData: Admin = { name, email, password, role: 'admin',key };

      this.data.registerAdmin(adminData).subscribe({
        next: () => {
          alert('Admin registered successfully!');
          this.router.navigate(['/login']);
          this.registerForm.reset();
        },
        error: () => alert('Error during admin registration!')
      });
    } else {
      const userData: User = { name, email, password, role: 'user' };

      this.data.registerUser(userData).subscribe({
        next: () => {
          alert('User registered successfully!');
          this.router.navigate(['/login']);
                    this.registerForm.reset();

        },
        error: () => alert('Error during user registration!')
      });
    }
}

}
