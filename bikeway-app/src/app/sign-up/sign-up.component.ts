import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';

declare let toastr: any;

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [HttpClientModule,FormsModule,CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export class SignUpComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  acceptedTerms: boolean = false; 

  constructor(private http: HttpClient, private router: Router) {} 

  ngOnInit() {
    this.setToastrOptions();
  }

  private setToastrOptions() {
    toastr.options = { closeButton: true, debug: false, newestOnTop: false, progressBar: true, positionClass: 'toast-top-right', preventDuplicates: false, onclick: null, showDuration: '300', hideDuration: '1500', timeOut: '1500', extendedTimeOut: '1500', showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' };
  }

  onSubmit() {
    if (!this.acceptedTerms) {
      alert("Veuillez accepter les conditions générales pour continuer.");
      return;
    }
    const user = { email: this.email, password: this.password, username: this.username };
    this.http.post('https://api.bikeway-victor.pro/api/user/register', user)
      .subscribe(response => {
        toastr.success('Your account was successfully created', 'Success');
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/account']);
      }, error => {
        toastr.error('There was an error creating your account, the email address might already be used', 'Error');
      });
  }
}