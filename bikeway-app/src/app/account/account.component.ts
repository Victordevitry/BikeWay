import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../theme-service.service';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule,HttpClientModule,RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  user: any;
  bikeRoutes: any[] = [];
  isDarkTheme: boolean = false;

  constructor(private http: HttpClient, private router: Router,private themeService: ThemeService) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchBikeRoutes(this.user.email);
    }
    this.isDarkTheme = this.themeService.getTheme() === 'dark'; // Set switch state based on theme

  }

  switchTheme() {
    this.themeService.toggleTheme();
    this.isDarkTheme = !this.isDarkTheme; // Update the switch state
  }

  fetchBikeRoutes(email: string) {
    this.http.get<any[]>(`http://localhost:5000/api/routes/${email}`)
      .subscribe(routes => {
        this.bikeRoutes = routes;
      }, error => {
        console.error('Erreur lors de la récupération des itinéraires :', error);
      });
  }
  deleteRoute(routeId: string): void {
    this.http.delete(`http://localhost:5000/api/routes/delete/${routeId}`).subscribe(
      () => {
        this.bikeRoutes = this.bikeRoutes.filter(route => route._id !== routeId);
        console.log('Itinéraire supprimé avec succès');
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'itinéraire :', error);
      }
    );
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.http.delete(`http://localhost:5000/api/user/delete/${this.user.email}`).subscribe(
        () => {
          console.log('Compte et itinéraires supprimés avec succès');
          localStorage.removeItem('user'); // Remove user data from local storage
          this.router.navigate(['/log-in']); // Redirect to the login page
        },
        (error) => {
          console.error('Erreur lors de la suppression du compte :', error);
        }
      );
    }
  }

  logout() {
    localStorage.removeItem('user'); // Remove user data from local storage
    this.router.navigate(['/log-in']); // Redirect to the login page
  }
}
