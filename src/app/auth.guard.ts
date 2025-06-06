import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const role = localStorage.getItem('role');
 if ((state.url === '/login' || state.url === '/register') && isLoggedIn) {
    return false;
  }
  if (!isLoggedIn) return false;

  // Example: protect admin route
  if (state.url.startsWith('/home') && role !== 'admin') return false;

  // Example: protect user route

  
  return true;
};
