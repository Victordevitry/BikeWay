import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Itinerary {
  title: string;
  departure: string;
  arrival: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-itinerary-list',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './itinerary-list.component.html',
  styleUrl: './itinerary-list.component.css'
})
export class ItineraryListComponent {
  cities = ['Paris', 'Barcelona'];
  selectedCity: string = this.cities[0]; // Default to Paris
  routes: { [key: string]: Itinerary[] } = {
    Paris: [
      {
        title: 'From Promenade Plantée to Bois de Vincennes',
        departure: '44 Rue de Lyon, 75012 Paris',
        arrival: 'Avenue de Nogent, 75012 Paris (Bois de Vincennes)',
        description: 'This route starts at the Promenade Plantée and heads towards the Bois de Vincennes, offering a green setting.',
        image: "/assets/images/p1_plantée_verte.webp",
      },
      {
        title: 'The Seine Quays (from the Eiffel Tower to Parc de Bercy)',
        departure: 'Quai Branly, 75007 Paris (near the Eiffel Tower)',
        arrival: 'Parc de Bercy, 128 Quai de Bercy, 75012 Paris',
        description: 'This route follows the quays and allows you to see several iconic monuments along the Seine.',
        image: "/assets/images/p2_quai_de_seine.jpeg",
      },
      {
        title: 'The Voie Georges-Pompidou to Bois de Boulogne',
        departure: 'Pont Neuf, 75001 Paris',
        arrival: 'Avenue de Saint-Cloud, 75016 Paris (Bois de Boulogne)',
        description: 'Ideal for a long ride along the Seine, this route ends in the Bois de Boulogne, a vast green space in western Paris.',
        image: "/assets/images/p3_voie_george_pompidou.jpg",
      },
      {
        title: 'The Canal Saint-Martin to La Villette',
        departure: '90 Quai de Jemmapes, 75010 Paris',
        arrival: 'Parc de la Villette, 211 Avenue Jean Jaurès, 75019 Paris',
        description: 'A pleasant route along the canal, passing through several lively neighborhoods and ending at the Parc de la Villette.',
        image: "/assets/images/p4_canal_saint_martin_villete.jpg",
      },
      {
        title: 'From Place de la Bastille to Parc Floral',
        departure: 'Place de la Bastille, 75011 Paris',
        arrival: 'Route de la Pyramide, 75012 Paris (Parc Floral)',
        description: 'Starting from Bastille, this route heads to the Parc Floral de Paris, a beautiful destination for enjoying gardens.',
        image: "/assets/images/p1_plantée_verte.webp",
      },
    ],
    Barcelona: [
      {
        title: 'From Ciutadella Park to Barceloneta Beach',
        departure: 'Passeig de Picasso, 21, 08003 Barcelona (Ciutadella Park)',
        arrival: 'Passeig Marítim de la Barceloneta, 08003 Barcelona',
        description: 'This route goes from the central Ciutadella Park down to the beach, perfect for a relaxing seaside ride.',
        image: "",
      },
      {
        title: 'From Plaça d’Espanya to Montjuïc',
        departure: 'Plaça d’Espanya, 08004 Barcelona',
        arrival: 'Castell de Montjuïc, Ctra. de Montjuïc, 66, 08038 Barcelona',
        description: 'Starting from the famous Plaça d’Espanya, this route ascends towards Montjuïc, offering panoramic views of Barcelona.',
        image: "",
      },
      {
        title: 'From Passeig de Gràcia to Parc Güell',
        departure: 'Passeig de Gràcia, 92, 08008 Barcelona',
        arrival: 'Carrer d’Olot, s/n, 08024 Barcelona (Parc Güell)',
        description: 'A route that begins in the modernist city center and ascends to Parc Güell, where cyclists can appreciate Gaudí’s unique architecture.',
        image: "",
      },
      {
        title: 'From Sagrada Família to Tibidabo',
        departure: 'Carrer de Mallorca, 401, 08013 Barcelona (Sagrada Família)',
        arrival: 'Parc d’Atraccions Tibidabo, 08035 Barcelona',
        description: 'This route offers a challenge with an ascent to the top of Tibidabo, but the panoramic views of the city make it worth the effort.',
        image: "",
      },
      {
        title: 'From Parc del Fòrum to Port Olímpic',
        departure: 'Carrer de la Pau, 12, 08930 Barcelona (Parc del Fòrum)',
        arrival: 'Carrer de la Marina, 19-21, 08005 Barcelona (Port Olímpic)',
        description: 'A pleasant seaside ride connecting Parc del Fòrum to Port Olímpic, ideal for cyclists looking to enjoy the Mediterranean coast.',
        image: "",
      },
    ],
  };

  get selectedRoutes() {
    return this.routes[this.selectedCity];
  }

  onCityChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCity = selectElement.value;
  }
}
