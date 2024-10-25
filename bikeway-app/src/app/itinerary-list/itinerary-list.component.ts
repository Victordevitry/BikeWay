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
  cities = ['Paris', 'Barcelone'];
  selectedCity: string = this.cities[0]; // Default to Paris
  routes: { [key: string]: Itinerary[] } = {
    Paris: [
      {
        title: 'De la Promenade Plantée au Bois de Vincennes',
        departure: '44 Rue de Lyon, 75012 Paris',
        arrival: 'Avenue de Nogent, 75012 Paris (Bois de Vincennes)',
        description: 'Cet itinéraire commence à la Promenade Plantée et se dirige vers le Bois de Vincennes, offrant un cadre verdoyant.',
        image:"/assets/images/p1_plantée_verte.webp",
      },
      {
        title: 'Les Quais de Seine (de la Tour Eiffel au Parc de Bercy)',
        departure: 'Quai Branly, 75007 Paris (près de la Tour Eiffel)',
        arrival: 'Parc de Bercy, 128 Quai de Bercy, 75012 Paris',
        description: 'Ce trajet suit les quais et permet de voir plusieurs monuments emblématiques le long de la Seine.',
        image:"/assets/images/p2_quai_de_seine.jpeg",
      },
      {
        title: 'La Voie Georges-Pompidou jusqu\'au Bois de Boulogne',
        departure: 'Pont Neuf, 75001 Paris',
        arrival: 'Avenue de Saint-Cloud, 75016 Paris (Bois de Boulogne)',
        description: 'Idéal pour un long trajet en bord de Seine, cet itinéraire se termine dans le Bois de Boulogne, un vaste espace vert à l\'ouest de Paris.',
        image:"/assets/images/p3_voie_george_pompidou.jpg",
      },
      {
        title: 'Le Canal Saint-Martin jusqu\'à la Villette',
        departure: '90 Quai de Jemmapes, 75010 Paris',
        arrival: 'Parc de la Villette, 211 Avenue Jean Jaurès, 75019 Paris',
        description: 'Un parcours agréable le long du canal qui traverse plusieurs quartiers animés et termine au parc de la Villette.',
        image:"/assets/images/p4_canal_saint_martin_villete.jpg",
      },
      {
        title: 'De la Place de la Bastille au Parc Floral',
        departure: 'Place de la Bastille, 75011 Paris',
        arrival: 'Route de la Pyramide, 75012 Paris (Parc Floral)',
        description: 'Depuis la Bastille, cet itinéraire se dirige vers le Parc Floral de Paris, une belle destination pour profiter des jardins.',
        image:"/assets/images/p1_plantée_verte.webp",
      },
    ],
    Barcelone: [
      {
        title: 'Du Parc de la Ciutadella à la Plage de la Barceloneta',
        departure: 'Passeig de Picasso, 21, 08003 Barcelone (Parc de la Ciutadella)',
        arrival: 'Passeig Marítim de la Barceloneta, 08003 Barcelone',
        description: 'Cet itinéraire descend depuis le parc central de la Ciutadella jusqu\'à la plage, parfait pour un trajet détente au bord de la mer.',
        image:"",
      },
      {
        title: 'De Plaça d\'Espanya à Montjuïc',
        departure: 'Plaça d\'Espanya, 08004 Barcelone',
        arrival: 'Castell de Montjuïc, Ctra. de Montjuïc, 66, 08038 Barcelone',
        description: 'En partant de la célèbre Plaça d’Espanya, ce trajet monte vers Montjuïc, offrant une vue panoramique sur Barcelone.',
        image:"",
      },
      {
        title: 'Du Passeig de Gràcia au Parc Güell',
        departure: 'Passeig de Gràcia, 92, 08008 Barcelone',
        arrival: 'Carrer d\'Olot, s/n, 08024 Barcelone (Parc Güell)',
        description: 'Un itinéraire qui commence dans le centre-ville moderniste et monte jusqu\'au Parc Güell, où les cyclistes peuvent apprécier l\'architecture unique de Gaudí.',
        image:"",
      },
      {
        title: 'De la Sagrada Família au Tibidabo',
        departure: 'Carrer de Mallorca, 401, 08013 Barcelone (Sagrada Família)',
        arrival: 'Parc d\'Atraccions Tibidabo, 08035 Barcelone',
        description: 'Ce parcours propose un défi avec une montée jusqu\'au sommet du Tibidabo, mais les vues panoramiques sur la ville valent bien l\'effort.',
        image:"",
      },
      {
        title: 'Du Parc del Fòrum au Port Olímpic',
        departure: 'Carrer de la Pau, 12, 08930 Barcelone (Parc del Fòrum)',
        arrival: 'Carrer de la Marina, 19-21, 08005 Barcelone (Port Olímpic)',
        description: 'Un trajet agréable en bord de mer qui relie le Parc del Fòrum au Port Olímpic, idéal pour les cyclistes souhaitant profiter de la côte méditerranéenne.',
        image:"",
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
