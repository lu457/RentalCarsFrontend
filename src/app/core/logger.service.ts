import { HttpClient } from '@angular/common/http';
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class LoggerService implements ErrorHandler {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private apiUrl = this.configService.apiUrl;

  constructor() {}

  logError(error: any): void {
    // console.error(`Error capturado:`, error);
    // this.http
    //   .post(`${this.apiUrl}/api/logs`, {
    //     error: error.message || error,
    //   })
    //   .subscribe();
  }

  handleError(error: any): void {
    this.logError(error);
  }
}