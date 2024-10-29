import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

function loadGoogleMapsAPI() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve(); 
    script.onerror = () => reject(new Error('Google Maps API script failed to load')); 

    document.body.appendChild(script); 
  });
}

loadGoogleMapsAPI()
  .then(() => bootstrapApplication(AppComponent, appConfig))
  .catch(err => console.error(err));

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
