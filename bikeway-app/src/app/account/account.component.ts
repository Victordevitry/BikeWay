import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare let toastr: any;
declare var google: any;

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})

export class AccountComponent implements AfterViewInit {
  user: any;
  bikeRoutes: any[] = [];
  ratings: { [key: string]: number } = {};
  hoveredRatings: { [key: string]: number } = {};
  addressType: string = 'home';
  address: string = '';
  constructor(private http: HttpClient, private router: Router) { }

  ngAfterViewInit(): void {
    const input = document.getElementById("address") as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        this.address = place.formatted_address;
      }
    });
  }

  ngOnInit() {
    this.setToastrOptions();
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchBikeRoutes(this.user.email);
    }
  }

  private setToastrOptions() {
    toastr.options = { closeButton: true, debug: false, newestOnTop: false, progressBar: true, positionClass: 'toast-top-right', preventDuplicates: false, onclick: null, showDuration: '300', hideDuration: '1500', timeOut: '1500', extendedTimeOut: '1500', showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' };
  }

  shareRoute(route: any) {
    const shareData = {
      title: 'Check out my bike route!',
      text: `From: ${route.origin} To: ${route.destination}`,
      url: `http://localhost:4200/home?origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}`
    };
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => { })
        .catch((error) => {
          toastr.error('There was an error sharing the route', 'Error');
        });
    } else {
      toastr.info('Sharing is not supported on this browser.', 'Info');
    }
  }

  convertToLocalTime(utcDate: string): string {
    const localDate = new Date(utcDate);
    return localDate.toLocaleString();
  }

  saveAddress(): void {

    const addressData = {
      email: this.user.email,
      type: this.addressType,
      address: this.address,
    };

    this.http.post('http://localhost:5000/api/user/saveAddress', addressData).subscribe(
      response => {
        toastr.success('Address saved successfully', "Success");
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (this.addressType === 'home') {
          user.homeAddress = this.address;
        } else if (this.addressType === 'work') {
          user.workAddress = this.address;
        }
        localStorage.setItem('user', JSON.stringify(user));
        this.user = user;
      },
      error => {
        toastr.error('There was an error saving your address', "Error");
      }
    );
  }

  setRating(routeId: string, rating: number): void {
    this.ratings[routeId] = rating;
    const route = this.bikeRoutes.find(r => r._id === routeId);
    if (route) {
      this.rateRoute(route, rating);
    } else {
      toastr.error('There was an error rating your route', 'Error');
    }
  }

  setHoveredRating(routeId: string, rating: number): void {
    this.hoveredRatings[routeId] = rating;
  }

  clearHoveredRating(routeId: string): void {
    this.hoveredRatings[routeId] = 0;
  }

  rateRoute(route: any, rating: number): void {
    route.rating = rating;
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
        routes.forEach(route => {
          this.ratings[route._id] = route.rating || 0;
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
          toastr.success(`Account and linked routes successfully deleted`, 'Success')
          localStorage.removeItem('user');
          this.router.navigate(['/log-in']);
        },
        (error) => {
          toastr.error(`There was an error deleting your account`, 'Error')
        }
      );
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
  }
}
