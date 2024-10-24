import { Component, AfterViewInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Input } from '@angular/core';

declare var google: any;

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
  user:any;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initMap();
    if (this.origin && this.destination) {
      this.showRouteFromSavedItinerary(this.origin,this.destination);    
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
        console.error('Error fetching directions', result);
      }
    });
  }

  showRouteFromSavedItinerary(start:String,end:String): void {
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
        console.error('Error fetching directions', result);
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
              console.error('Aucune adresse trouvée pour cette position:', status);
            }
          });
        }, (error) => {
          console.error('Erreur lors de l\'obtention de la position:', error);
        });
      } else {
        console.error('La géolocalisation n\'est pas supportée par ce navigateur.');
      }
    } else {
      (document.getElementById("start-adress") as HTMLInputElement).value = '';
    }
  }


  saveRoute(): void {
    const start = (document.getElementById("start-adress") as HTMLInputElement).value;
    const end = (document.getElementById("end-adress") as HTMLInputElement).value;
  
    if (!start || !end) {
      console.error('Les champs d\'adresse de départ ou d\'arrivée sont vides.');
      return;
    }
  
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }else{
      console.log("user non trouvé, pas connecté?")
      return;
    }
  
    const route = {
      origin: start,
      destination: end,
      userEmail: this.user.email, // Utilisation de l'email au lieu de l'ID
    };
  
    this.http.post('http://localhost:5000/api/routes/save', route)
      .subscribe(response => {
        console.log('Itinéraire enregistré avec succès !', response);
      }, error => {
        console.error('Erreur lors de l\'enregistrement de l\'itinéraire :', error);
      });
  }
  
  

}
