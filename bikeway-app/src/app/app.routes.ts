import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AProposComponent } from './a-propos/a-propos.component';
import { ContactComponent } from './contact/contact.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'a-propos', component: AProposComponent },
    { path: 'log-in', component: LogInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'contact', component: ContactComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
  ];
  
