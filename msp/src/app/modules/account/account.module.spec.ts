import { TestBed } from '@angular/core/testing';
import { ProcessService } from '../../services/process.service';
import { AccountModule } from './account.module';

describe('AccountModule', () => {
  let accountModule: AccountModule;

  beforeEach(() => {
    const processServiceStub = () => ({ init: () => ({}) });

    TestBed.configureTestingModule({
      providers: [
        AccountModule,
        { provide: ProcessService, useFactory: processServiceStub }
      ]
    });

    accountModule = TestBed.inject(AccountModule);
  });

  it('should create an instance', () => {
    expect(accountModule).toBeTruthy();
  });
});
