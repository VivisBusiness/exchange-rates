import { TestBed } from '@angular/core/testing';

import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRate } from '../../models/exchange-rate';
import { LocalStorageService } from '../local-storage/local-storage.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LocalStorageService', ['setItem', 'getItem', 'removeItem', 'clear']);
    
    TestBed.configureTestingModule({
      providers: [
        ExchangeRateService,
        { provide: LocalStorageService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(ExchangeRateService);
    localStorageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new exchange rate', () => {
    const rate: ExchangeRate = { id: 1, rate: 1.2, code: 'USD' };
    
    service.addExchangeRate(rate);
    
    expect(service.getExchangeRates()).toContain(rate);
    expect(localStorageServiceSpy.setItem).toHaveBeenCalledWith('exchangeRates', [rate]);
  });

  it('should update an existing exchange rate', () => {
    const rate: ExchangeRate = { id: 1, rate: 1.2, code: 'USD' };
    service.addExchangeRate(rate);
    
    const updatedRate: ExchangeRate = { id: 1, rate: 1.5, code: 'USD' };
    service.updateExchangeRate(updatedRate);

    expect(service.getExchangeRates()).toContain(updatedRate);
    expect(service.getExchangeRates()).not.toContain(rate);
    expect(localStorageServiceSpy.setItem).toHaveBeenCalled();
  });

  it('should delete an exchange rate', () => {
    const rate: ExchangeRate = { id: 1, rate: 1.2, code: 'USD' };
    service.addExchangeRate(rate);
    
    service.deleteExchangeRate(1);
    
    expect(service.getExchangeRates()).not.toContain(rate);
    expect(localStorageServiceSpy.setItem).toHaveBeenCalled();
  });

  it('should return all exchange rates', () => {
    const rate1: ExchangeRate = { id: 1, rate: 1.2, code: 'USD' };
    const rate2: ExchangeRate = { id: 2, rate: 0.9, code: 'EUR' };
    service.addExchangeRate(rate1);
    service.addExchangeRate(rate2);

    expect(service.getExchangeRates()).toEqual([rate1, rate2]);
  });
});
