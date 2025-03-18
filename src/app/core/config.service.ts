import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private static config: any = {};

  static setConfig(config: any): void {
    ConfigService.config = config;
  }

  get apiUrl(): string {
    return ConfigService.config?.apiUrl || 'https://localhost:7297';
  }
}

