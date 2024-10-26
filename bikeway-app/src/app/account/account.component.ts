import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule ici

declare let toastr: any;
declare var google: any;


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule,HttpClientModule,RouterModule,FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements AfterViewInit{
  user: any;
  bikeRoutes: any[] = [];
  ratings: { [key: string]: number } = {}; // Store ratings by route ID
  hoveredRatings: { [key: string]: number } = {}; // Store hovered ratings by route ID
  addressType: string = 'home';
  address: string = '';

  constructor(private http: HttpClient, private router: Router) {}
  
  ngAfterViewInit(): void {
    const input = document.getElementById("address") as HTMLInputElement;

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        this.address = place.formatted_address; // Set the full address
      }
    });

  }

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.getUserData();
      this.fetchBikeRoutes(this.user.email);
    }
  }

  getUserData() {
    const userEmail = this.user.email;

    this.http.get(`http://localhost:5000/api/user/${userEmail}`)
      .subscribe(
        (response: any) => {
          this.user = response.user;
        },
        (error) => {
          toastr.error('There was an error fetching user data', "Error");
        }
      );
  }

  saveAddress(): void {
    // Structure des données à envoyer
    const addressData = {
      email:this.user.email,
      type: this.addressType,
      address: this.address,
    };

    // Requête HTTP POST pour envoyer les données
    this.http.post('http://localhost:5000/api/user/saveAddress', addressData).subscribe(
      response => {
        toastr.success('Address saved successfully', "Success");
        this.getUserData();
      },
      error => {
        toastr.error('There was an error saving your address', "Error");
      }
    );
  }

  setRating(routeId: string, rating: number): void {
    this.ratings[routeId] = rating; // Store the rating locally for UI updates
  
    // Find the route object in the bikeRoutes array
    const route = this.bikeRoutes.find(r => r._id === routeId);
    
    // Call rateRoute if the route was found
    if (route) {
      this.rateRoute(route, rating);
    } else {
      toastr.error('There was an error rating your route', 'Error');

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
        updatedRoute => toastr.info(`Route rated with ${rating} stars`, 'Info'),
        error => toastr.error(`There was an error rating your route`, 'Error')
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
        toastr.error(`There was an error fetching your savec itineraries`, 'Error')
      });
  }
  
  deleteRoute(routeId: string): void {
    this.http.delete(`http://localhost:5000/api/routes/delete/${routeId}`).subscribe(
      () => {
        this.bikeRoutes = this.bikeRoutes.filter(route => route._id !== routeId);
        toastr.success(`Route successfully deleted`, 'Success');
      },
      (error) => {
        toastr.error(`There was an error deleting the route`, 'Error')
      }
    );
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.http.delete(`http://localhost:5000/api/user/delete/${this.user.email}`).subscribe(
        () => {
          toastr.success(`Account and linked itineraries successfully deleted`, 'Success')
          localStorage.removeItem('user'); // Remove user data from local storage
          this.router.navigate(['/log-in']); // Redirect to the login page
        },
        (error) => {
          toastr.error(`There was an error deleting your account`, 'Error')
        }
      );
    }
  }

  logout() {
    localStorage.removeItem('user'); // Remove user data from local storage
    this.router.navigate(['/home']); // Redirect to the login page
  }
}
