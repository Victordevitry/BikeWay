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
  markers: any[] = []; // Array to hold markers

  lightMapStyles: any = [{ "featureType": "all", "elementType": "labels.text", "stylers": [{ "color": "#878787" }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f9f5ed" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "color": "#f5f5f5" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#c9c9c9" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#aee0f4" }] }];

  darkMapStyles: any = [{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 13 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#144b53" }, { "lightness": 14 }, { "weight": 1.4 }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#08304b" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#0c4152" }, { "lightness": 5 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#0b434f" }, { "lightness": 25 }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#0b3d51" }, { "lightness": 16 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "color": "#146474" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#021019" }] }];

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
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true // This suppresses the default markers
    });
    this.directionsRenderer.setMap(this.map);
    this.map.setZoom(12); // Adjust this value as needed (e.g., 15 for a closer view)

    const startInput = document.getElementById("start-adress") as HTMLInputElement;
    const endInput = document.getElementById("end-adress") as HTMLInputElement;

    const startAutocomplete = new google.maps.places.Autocomplete(startInput);
    const endAutocomplete = new google.maps.places.Autocomplete(endInput);

    const searchButton = document.getElementById('search-route');
    searchButton?.addEventListener('click', () => this.calculateRoute());

    // Set initial style based on the current theme
    this.setMapStyle(this.themeService.getTheme());

  }

  clearMarkers(): void {
    this.markers.forEach(marker => {
      marker.setMap(null); // Remove marker from the map
    });
    this.markers = []; // Clear the markers array
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

  displayBikeStations(): void {
    this.bikeStations.forEach((station) => {
      if (station.geometry && station.geometry.location) {
        const marker = new google.maps.Marker({
          position: station.geometry.location,
          map: this.map,
          icon: 'https://img.icons8.com/arcade/50/bicycle.png', // Directly using the URL for bike station icon
          title: station.name,
        });
        this.markers.push(marker);
      }
    });
  }

  calculateRoute(): void {
    this.clearMarkers();
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

        const startLocation = result.routes[0].legs[0].start_location;
        const endLocation = result.routes[0].legs[0].end_location;

        // Add markers for start and end points
        const markerBegin = new google.maps.Marker({
          position: startLocation,
          map: this.map,
          icon: 'https://img.icons8.com/color/50/marker--v1.png',
          title: 'Start Location',
        });
        this.markers.push(markerBegin);

        const markerEnd = new google.maps.Marker({
          position: endLocation,
          map: this.map,
          icon: 'https://img.icons8.com/color/50/marker--v1.png',
          title: 'End Location',
        });
        this.markers.push(markerEnd);

        // Clear any existing info box in TOP_CENTER position
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].clear();

        // Get elevation at start and end points
        const path = [startLocation, endLocation];
        const elevationService = new google.maps.ElevationService();

        elevationService.getElevationForLocations({ locations: path }, (results: string | any[], status: any) => {
          if (status === google.maps.ElevationStatus.OK && results.length > 1) {
            const startElevation = results[0].elevation;
            const endElevation = results[1].elevation;
            const elevationDifference = endElevation - startElevation;

            // Create an info box with the elevation data
            const infoDiv = document.createElement('div');
            infoDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            infoDiv.style.padding = '20px';
            infoDiv.style.border = '1px solid #000';
            infoDiv.style.borderRadius = '5px';
            infoDiv.style.marginTop = '10px';
            infoDiv.style.fontSize = '18px';
            infoDiv.style.opacity = '1 !important';
            infoDiv.style.color = 'black';

            infoDiv.innerHTML = `
                        <div style='color:#000080'><strong>Route Details:</strong><br></div>
                        Duration: ${result.routes[0].legs[0].duration.text}<br>
                        Distance: ${result.routes[0].legs[0].distance.text}<br>
                        Elevation Difference: ${elevationDifference.toFixed(2)} meters
                    `;

            // Add the new info box to the TOP_CENTER position
            this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoDiv);
          } else {
            toastr.error('Failed to retrieve elevation data', 'Error');
          }
        });
      } else {
        toastr.info('Please fill both start and end address to show the route', 'Info');
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
          this.map.setZoom(16); // Adjust this value as needed (e.g., 15 for a closer view)
          const markerLocation = new google.maps.Marker({
            position: { lat, lng },
            map: this.map,
            icon: 'https://img.icons8.com/color/50/marker--v1.png', // You can customize the icon URL
            title: 'Your Location',
          });
          this.markers.push(markerLocation);

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
      toastr.info('Please show first the route on the map to be able to save it', 'Info');
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
