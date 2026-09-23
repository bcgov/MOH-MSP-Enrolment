import { TestBed } from '@angular/core/testing';
import { ProcessService } from '../../services/process.service';
import { BenefitModule } from './benefit.module';

describe('BenefitModule', () => {
  let benefitModule: BenefitModule;
  beforeEach(() => {
    const processServiceStub = () => ({ init: () => ({}) });
    TestBed.configureTestingModule({
      providers: [
        BenefitModule,
        { provide: ProcessService, useFactory: processServiceStub }
      ]
    });
    benefitModule = TestBed.inject(BenefitModule);
  });

  it('should create', () => {
    expect(benefitModule).toBeTruthy();
  });
});
