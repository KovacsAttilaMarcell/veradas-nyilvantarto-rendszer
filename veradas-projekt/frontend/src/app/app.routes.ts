import { Routes } from '@angular/router';
import { Locations } from './pages/locations/locations';
import { Donors } from './pages/donors/donors';
import { AddDonation } from './pages/add-donation/add-donation';
import { ViewDonations } from './pages/view-donations/view-donations';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'locations', pathMatch: 'full' },

  // publikus olvasási oldalak
  { path: 'locations', component: Locations },
  { path: 'donors', component: Donors },
  { path: 'view-donations', component: ViewDonations },

  // auth oldalak
  { path: 'register', component: Register },
  { path: 'login', component: Login },

  // védett író oldal
  { path: 'add-donation', component: AddDonation, canActivate: [authGuard] },
];