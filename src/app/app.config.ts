import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';
import { ConfigService } from './core/config.service';
import { HttpErrorInterceptorService } from './core/http-error-interceptor.service';
import { LoggerService } from './core/logger.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    ConfigService,
    { provide: ErrorHandler, useClass: LoggerService },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptorService },
  ],
};
