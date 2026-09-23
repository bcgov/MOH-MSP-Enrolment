import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonDeductionCalculatorComponent } from './common-deduction-calculator.component';
import { MspCancelComponent } from '../../../../../app/components/msp/common/cancel/cancel.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { ProcessService } from '../../../../services/process.service';
import { MspDataService } from '../../../../services/msp-data.service';
import { BenefitApplication } from '../../../benefit/models/benefit-application.model';

describe('CommonDeductionCalculatorComponent', () => {
  let component: CommonDeductionCalculatorComponent;
  let fixture: ComponentFixture<CommonDeductionCalculatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonDeductionCalculatorComponent, MspCancelComponent ],
      imports: [
        FormsModule,
        ModalModule.forRoot(),
        RouterTestingModule,
],
      providers: [
        LocalStorageService,
        ProcessService,
        MspDataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDeductionCalculatorComponent);
    component = fixture.componentInstance;
    spyOn(component._processService, 'setStep').and.returnValue(null);
    component.application = new BenefitApplication();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
