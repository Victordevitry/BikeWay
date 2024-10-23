import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Add this line

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

  constructor(private http: HttpClient) {}

  onSubmit() {
    const user = { email: this.email, password: this.password, username: this.username };
    console.log(user);
    this.http.post('http://localhost:5000/api/auth/register', user)
      .subscribe(response => {
        console.log('User created:', response);
      }, error => {
        console.error('Error creating user:', error);
      });
  }
}