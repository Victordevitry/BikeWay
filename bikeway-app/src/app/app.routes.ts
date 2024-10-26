import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AProposComponent } from './a-propos/a-propos.component';
import { ContactComponent } from './contact/contact.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './auth.guard';
import { AccountComponent } from './account/account.component';
import { ItineraryListComponent } from './itinerary-list/itinerary-list.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'a-propos', component: AProposComponent },
    { path: 'popular-routes', component: ItineraryListComponent },
    { path: 'log-in', component: LogInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'account', component: AccountComponent, canActivate:[AuthGuard] },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' } 

  ];
  
