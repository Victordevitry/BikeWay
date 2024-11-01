import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryListComponent } from './itinerary-list.component';

describe('ItineraryListComponent', () => {
  let component: ItineraryListComponent;
  let fixture: ComponentFixture<ItineraryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItineraryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItineraryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
