import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(success => {
    if (!environment.production)
      console.log("Application bootstrapped successfully!")
  })
  .catch(error => console.error("Error bootstrapping application: " + error));