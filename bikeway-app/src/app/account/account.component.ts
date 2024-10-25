import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


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
  ratings: { [key: string]: number } = {}; // Store ratings by route ID
  hoveredRatings: { [key: string]: number } = {}; // Store hovered ratings by route ID

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchBikeRoutes(this.user.email);
    }

  }

  setRating(routeId: string, rating: number): void {
    this.ratings[routeId] = rating; // Store the rating locally for UI updates
  
    // Find the route object in the bikeRoutes array
    const route = this.bikeRoutes.find(r => r._id === routeId);
    
    // Call rateRoute if the route was found
    if (route) {
      this.rateRoute(route, rating);
    } else {
      console.error('Route not found');
    }
  }
  

  setHoveredRating(routeId: string, rating: number): void {
    this.hoveredRatings[routeId] = rating; // Ensure `hoveredRatings` uses routeId as the key
  }

  clearHoveredRating(routeId: string): void {
    this.hoveredRatings[routeId] = 0;
  }

  rateRoute(route: any, rating: number): void {
    route.rating = rating; // Update the route rating locally
  
    // Send the updated rating to the backend
    this.http.put(`http://localhost:5000/api/routes/rate/${route._id}`, { rating })
      .subscribe(
        updatedRoute => console.log(`Itinéraire noté avec ${rating} étoiles`),
        error => console.error('Erreur lors de la notation de l\'itinéraire :', error)
      );
  }
  

  fetchBikeRoutes(email: string) {
    this.http.get<any[]>(`http://localhost:5000/api/routes/${email}`)
      .subscribe(routes => {
        this.bikeRoutes = routes;
  
        // Populate the ratings object based on the fetched routes
        routes.forEach(route => {
          this.ratings[route._id] = route.rating || 0; // Set to 0 if no rating exists
        });
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
