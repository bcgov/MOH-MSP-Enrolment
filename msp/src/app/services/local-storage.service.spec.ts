import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    window.sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('round-trips a value through set and get, prefixed in sessionStorage', () => {
    service.set('myKey', { a: 1, b: 'two' });

    expect(service.get('myKey')).toEqual({ a: 1, b: 'two' });
    expect(window.sessionStorage.getItem('ca.bc.gov.msp.myKey')).toBe('{"a":1,"b":"two"}');
  });

  it('treats a stored "null" sentinel as no value', () => {
    window.sessionStorage.setItem('ca.bc.gov.msp.myKey', 'null');

    expect(service.get('myKey')).toBeNull();
  });

  it('stores undefined as the "null" sentinel', () => {
    service.set('myKey', undefined);

    expect(window.sessionStorage.getItem('ca.bc.gov.msp.myKey')).toBe('null');
    expect(service.get('myKey')).toBeNull();
  });

  it('returns null for a key that was never set', () => {
    expect(service.get('neverSet')).toBeNull();
  });

  it('clearAll removes only prefix-scoped keys', () => {
    service.set('mine', 'value');
    window.sessionStorage.setItem('someOtherApp.theirs', 'untouched');

    const result = service.clearAll();

    expect(result).toBe(true);
    expect(service.get('mine')).toBeNull();
    expect(window.sessionStorage.getItem('someOtherApp.theirs')).toBe('untouched');
  });

  describe('when sessionStorage is blocked', () => {
    let originalDescriptor: PropertyDescriptor;

    beforeEach(() => {
      originalDescriptor = Object.getOwnPropertyDescriptor(window, 'sessionStorage');
      Object.defineProperty(window, 'sessionStorage', {
        configurable: true,
        get: () => {
          throw new DOMException('The operation is insecure.', 'SecurityError');
        }
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'sessionStorage', originalDescriptor);
    });

    it('does not throw constructing the service, and degrades every method quietly', () => {
      // Bypass TestBed/DI here: LocalStorageService has no injected
      // dependencies, and the bug this covers is a throw from the class
      // field initialiser itself, at construction time.
      let blockedService: LocalStorageService;
      expect(() => { blockedService = new LocalStorageService(); }).not.toThrow();

      expect(blockedService.get('anyKey')).toBeNull();
      expect(blockedService.set('anyKey', 'value')).toBe(false);
      expect(blockedService.clearAll()).toBe(false);
    });
  });
});
