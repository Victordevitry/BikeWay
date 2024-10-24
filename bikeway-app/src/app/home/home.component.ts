import { Component, OnInit } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  routeData: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.routeData = {
        origin: params['origin'],
        destination: params['destination']
      };
    });
  }
}
