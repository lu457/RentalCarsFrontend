import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ConfigService } from './app/core/config.service';

fetch('/assets/config.json')
  .then((response) => response.json())
  .then((config) => {
    ConfigService.setConfig(config);
    return bootstrapApplication(AppComponent, appConfig);
  })
  .catch((error) => {
    console.error('❌ No se pudo cargar config.json:', error);
  });

