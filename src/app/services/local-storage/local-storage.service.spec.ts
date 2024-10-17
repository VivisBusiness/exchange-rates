import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    localStorage.clear(); 

    // Spy on the localStorage methods.
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'key1') {
        return JSON.stringify({ name: 'Test' });
      }
      return null;
    });
    spyOn(localStorage, 'removeItem');
    spyOn(localStorage, 'clear');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set an item in localStorage', () => {
    const key = 'key1';
    const value = { name: 'Test' };

    service.setItem(key, value);
    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  it('should get an item from localStorage', () => {
    const key = 'key1';
    const result = service.getItem<{ name: string }>(key);

    expect(result).toEqual({ name: 'Test' });
    expect(localStorage.getItem).toHaveBeenCalledWith(key);
  });

  it('should return null for a non-existing item', () => {
    const result = service.getItem('nonExistingKey');
    expect(result).toBeNull();
    expect(localStorage.getItem).toHaveBeenCalledWith('nonExistingKey');
  });

  it('should remove an item from localStorage', () => {
    const key = 'key1';

    service.removeItem(key);
    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  it('should clear all items from localStorage', () => {
    service.clear();
    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('should check if an item exists in localStorage', () => {
    const key = 'key1';

    expect(service.exists(key)).toBeTrue();
    expect(service.exists('nonExistingKey')).toBeFalse();
  });
});