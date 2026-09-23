import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AclDataService } from './acl-data.service';

describe('AclDataService', () => {
  let service: AclDataService;
  beforeEach(() => {
    const localStorageServiceStub = () => ({
      set: () => ({}),
      get: () => ({})
    });

    TestBed.configureTestingModule({
      providers: [
        AclDataService,
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });

    service = TestBed.inject(AclDataService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('saveApplication', () => {
    it('makes expected call', () => {
      const localStorageServiceStub: LocalStorageService = TestBed.inject(
        LocalStorageService
      );
      spyOn(localStorageServiceStub, 'set').and.callThrough();
      service.saveApplication();
      expect(localStorageServiceStub.set).toHaveBeenCalled();
    });
  });
});
