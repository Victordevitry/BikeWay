import { Component, AfterViewInit  } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {

  map: any;
  directionsService: any;
  directionsRenderer: any;
  geocoder: any;

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 41.3851, lng: 2.1734 }, 
      zoom: 12, 
      styles: [
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "transit",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "water",
          stylers: [{ visibility: "on" }]
        },
        {
          featureType: "landscape",
          stylers: [{ visibility: "on" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ visibility: "on" }]
        }
      ]
    });
    this.geocoder = new google.maps.Geocoder();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);

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

  toggleLocation(): void {
    const switchElement = document.getElementById("switch") as HTMLInputElement;
    if (switchElement.checked) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
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

}
