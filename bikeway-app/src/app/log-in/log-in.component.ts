import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

declare let toastr: any;

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})

export class LogInComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.setToastrOptions();
  }

  private setToastrOptions() {
    toastr.options = { closeButton: true, debug: false, newestOnTop: false, progressBar: true, positionClass: 'toast-top-right', preventDuplicates: false, onclick: null, showDuration: '300', hideDuration: '1500', timeOut: '1500', extendedTimeOut: '1500', showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' };
  }

  onLogin() {
    if (!this.email || !this.password) {
      toastr.info('Please fill both mail and password inputs', 'Info');
      return;
    }
    const user = { email: this.email, password: this.password };
    this.http.post<any>('https://api.bikeway-victor.pro/api/user/login', user)
      .subscribe(response => {
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/']);
      }, error => {
        toastr.info('Invalid mail or password', 'Info');
      });
  }
}
