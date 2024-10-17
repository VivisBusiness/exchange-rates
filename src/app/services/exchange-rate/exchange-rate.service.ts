import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, catchError, from, map, throwError } from 'rxjs';

import { ExchangeRate } from '../../models/exchange-rate';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  private exchangeRates: ExchangeRate[] = [];

  constructor(private localStorageService: LocalStorageService) {
    //Load exchange rates from Local Storage on initialization
    this.loadFromLocalStorage();
  }

  /**
   * Fetch exchange rates from the API.
   * @returns Observable of ExchangeRate array.
   */
  fetchExchangeRates(): Observable<ExchangeRate[]> {
    return from(axios.get(`${environment.apiUrlExchangerate}`, {
      headers: {
        'x-rapidapi-key': environment.xRapidApiKey,
        'x-rapidapi-host': environment.xRapidapiHost
      }
    }))
    .pipe(
      map(response => {
        if (Array.isArray(response.data)) {
          return response.data as ExchangeRate[];
        }
        throw new Error('Unexpected response structure');
      }),
      catchError(error => {
        return throwError(() => new Error('Error fetching exchange rates: ' +  error.message));
      })
    );
  }

  addExchangeRate(rate: ExchangeRate): void {
    this.exchangeRates.push(rate);
    this.saveToLocalStorage();
  }

  updateExchangeRate(updatedRate: ExchangeRate): void {
    const index = this.exchangeRates.findIndex(r => r.id === updatedRate.id);
    if (index > -1) {
      this.exchangeRates[index] = updatedRate;
      this.saveToLocalStorage();
    }
  }

  deleteExchangeRate(id: number): void {
    this.exchangeRates = this.exchangeRates.filter(r => r.id !== id);
    this.saveToLocalStorage();
  }

  getExchangeRates(): ExchangeRate[] {
    return this.exchangeRates;
  }

  private saveToLocalStorage(): void {
    this.localStorageService.setItem('exchangeRates', this.exchangeRates);
  }

  private loadFromLocalStorage(): void {
    const data = this.localStorageService.getItem<ExchangeRate[]>('exchangeRates');
    if (data) {
      this.exchangeRates = data;
    }
  }
}
