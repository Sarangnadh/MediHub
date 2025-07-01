import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
 const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const router = inject(Router);

  // Allow only if token and role are set
  if (token && (role === 'admin' || role === 'user')) {
    return true;
  } else {
    alert('You must log in to access this page');
    router.navigate(['/login']);
    return false;
  }
};
