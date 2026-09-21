import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressComponent, CheckboxComponent, FormActionBarComponent, PageFrameworkComponent, PageSectionComponent, PhoneNumberComponent } from 'moh-common-lib-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContactInfoComponent } from './contact-info.component';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { ProcessService } from '../../../../services/process.service';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspLogService } from '../../../../services/log.service';

describe('ContactInfoComponent', () => {
  let component: ContactInfoComponent;
  let fixture: ComponentFixture<ContactInfoComponent>;

  beforeEach(waitForAsync(() => {
    const mspLogServiceStub = () => ({ log: () => undefined });
    TestBed.configureTestingModule({
      declarations: [ ContactInfoComponent ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule, AddressComponent, CheckboxComponent, FormActionBarComponent, PageFrameworkComponent, PageSectionComponent, PhoneNumberComponent],
      providers: [
        MspAccountMaintenanceDataService,
        ProcessService,
        MspDataService,
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfoComponent);
    component = fixture.componentInstance;
    spyOn(component._processService, 'setStep').and.returnValue(null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
