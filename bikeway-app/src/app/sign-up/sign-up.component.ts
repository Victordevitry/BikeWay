import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Add this line
import { Router } from '@angular/router'; // Add this line

declare let toastr: any;

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [HttpClientModule,FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  acceptedTerms: boolean = false; // Nouvelle variable pour le suivi des conditions acceptées

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  onSubmit() {
    if (!this.acceptedTerms) {
      alert("Veuillez accepter les conditions générales pour continuer.");
      return;
    }
    const user = { email: this.email, password: this.password, username: this.username };
    
    this.http.post('http://localhost:5000/api/user/register', user)
      .subscribe(response => {
        toastr.success('Your account was successfully created', 'Success');
        
        // Save user data to localStorage (or any other method) to simulate login
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to the home page
        this.router.navigate(['/home']);
      }, error => {
        toastr.error('There was an error creating your account', 'Error');
      });
  }
}