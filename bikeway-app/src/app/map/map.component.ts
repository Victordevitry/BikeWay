import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Input } from '@angular/core';
import { ThemeService } from '../theme-service.service';

declare var google: any;
declare let toastr: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {
  @Input() origin!: string;
  @Input() destination!: string;

  map: any;
  directionsService: any;
  directionsRenderer: any;
  geocoder: any;
  user: any;
  bikeStations: any[] = [];
  watchId: number | null = null;

  lightMapStyles: any = [
    { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] },
    { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] },
    { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] },
    { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] },
    { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] },
    { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] }
  ];
  
  darkMapStyles: any = [
    { "featureType": "all", "elementType": "all", "stylers": [{ "hue": "#ff0000" }, { "saturation": -100 }, { "lightness": -30 }] },
    { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "color": "#353535" }] },
    { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#656565" }] },
    { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "color": "#505050" }] },
    { "featureType": "poi", "elementType": "geometry.stroke", "stylers": [{ "color": "#808080" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#454545" }] },
    { "featureType": "transit", "elementType": "labels", "stylers": [{ "hue": "#000000" }, { "saturation": 100 }, { "lightness": -40 }, { "invert_lightness": true }, { "gamma": 1.5 }] }
  ];
  
  constructor(private http: HttpClient, private themeService: ThemeService) { }

  ngAfterViewInit(): void {
    this.initMap();

    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.setMapStyle(theme);
    });

    if (this.origin && this.destination) {
      this.showRouteFromSavedItinerary(this.origin, this.destination);
    }
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 41.3851, lng: 2.1734 },
      zoom: 12,
    });
    this.geocoder = new google.maps.Geocoder();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    const startInput = document.getElementById("start-adress") as HTMLInputElement;
    const endInput = document.getElementById("end-adress") as HTMLInputElement;

    const startAutocomplete = new google.maps.places.Autocomplete(startInput);
    const endAutocomplete = new google.maps.places.Autocomplete(endInput);

    const searchButton = document.getElementById('search-route');
    searchButton?.addEventListener('click', () => this.calculateRoute());

    // Set initial style based on the current theme
    this.setMapStyle(this.themeService.getTheme());

  }




  setMapStyle(theme: string): void {
    const styles = theme === 'dark' ? this.darkMapStyles : this.lightMapStyles;
    this.map.setOptions({ styles });
  }

  // New method to get nearby bike stations
  getNearbyBikeStations(): void {
    const bounds = this.map.getBounds(); // Get the current map bounds

    if (!bounds) {
      toastr.error('There was an error showing nearby bike stations', 'Error');
      return;
    }

    const request = {
      bounds: bounds,  // Use the current map bounds instead of a fixed radius
      keyword: 'bike rental',  // This will search for places that match the keyword
    };

    const service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch(request, (results: any, status: any, pagination: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.bikeStations = results;
        this.displayBikeStations();

        // Check if there are more results to load
        if (pagination.hasNextPage) {
          setTimeout(() => pagination.nextPage(), 200); // Delay to avoid quota limit issues
        }
      } else {
        toastr.error('There was an error showing nearby bike stations', 'Error');
      }
    });
  }

  // Method to display bike stations on the map
  displayBikeStations(): void {
    this.bikeStations.forEach((station) => {
      if (station.geometry && station.geometry.location) {
        new google.maps.Marker({
          position: station.geometry.location,
          map: this.map,
          title: station.name,
        });
      }
    });
  }

  calculateRoute(): void {
    const start = (document.getElementById("start-adress") as HTMLInputElement).value;
    const end = (document.getElementById("end-adress") as HTMLInputElement).value;

    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.BICYCLING,
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
      } else {
        toastr.error('There was an error showing the route', 'Error');
      }
    });
  }

  showRouteFromSavedItinerary(start: String, end: String): void {
    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.BICYCLING,
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
        (document.getElementById("start-adress") as HTMLInputElement).value = start.toString();
        (document.getElementById("end-adress") as HTMLInputElement).value = end.toString();

      } else {
        toastr.error('There was an error showing the route', 'Error');
      }
    });
  }

  toggleLocation(): void {
    const switchElement = document.getElementById("switch") as HTMLInputElement;
    if (switchElement.checked) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.map.setCenter({ lat, lng });

          this.geocoder.geocode({ location: { lat, lng } }, (results: { formatted_address: string; }[], status: string) => {
            if (status === 'OK' && results[0]) {
              (document.getElementById("start-adress") as HTMLInputElement).value = results[0].formatted_address;
            } else {
              toastr.error('No address was found for your location', 'Error');
            }
          });
        }, (error) => {
          toastr.error('There was an error accessing your location', 'Error');
        });
      } else {
        toastr.error('Your browser does not support this functionnality', 'Error');
      }
    } else {
      (document.getElementById("start-adress") as HTMLInputElement).value = '';
    }
  }


  saveRoute(): void {
    const start = (document.getElementById("start-adress") as HTMLInputElement).value;
    const end = (document.getElementById("end-adress") as HTMLInputElement).value;

    if (!start || !end) {
      toastr.info('Please fill both start and end address of your route', 'Info');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      toastr.info('Please connect to your account to save this route', 'Info');
      return;
    }

    const route = {
      origin: start,
      destination: end,
      userEmail: this.user.email, // Utilisation de l'email au lieu de l'ID
    };

    this.http.post('http://localhost:5000/api/routes/save', route)
      .subscribe(response => {
        toastr.success('Route successfully saved', 'Success');
      }, error => {
        toastr.error('There was an error saving the route', 'Error');
      });
  }



}
