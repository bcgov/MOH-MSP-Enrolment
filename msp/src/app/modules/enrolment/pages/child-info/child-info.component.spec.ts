import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressComponent, ButtonComponent, DateComponent, ErrorContainerComponent, FormActionBarComponent, PageFrameworkComponent, PageSectionComponent, RadioComponent, XiconButtonComponent } from 'moh-common-lib-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ChildInfoComponent } from './child-info.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { EnrolApplication } from '../../models/enrol-application';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MspLogService } from '../../../../services/log.service';

describe('ChildInfoComponent', () => {
  let component: ChildInfoComponent;
  let fixture: ComponentFixture<ChildInfoComponent>;
  const pageStateServiceStub = () => ({
    setPageIncomplete: () => ({})
  });
  const enrolDataServiceStub = () => ({
    application: new EnrolApplication()
  });

  beforeEach(waitForAsync(() => {
    const mspLogServiceStub = () => ({ log: () => undefined });
    TestBed.configureTestingModule({
      declarations: [ ChildInfoComponent ],
      imports: [
        FormsModule,
        MspCoreModule,
        RouterTestingModule,
        HttpClientTestingModule, AddressComponent, ButtonComponent, DateComponent, ErrorContainerComponent, FormActionBarComponent, PageFrameworkComponent, PageSectionComponent, RadioComponent, XiconButtonComponent],
      providers: [
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: EnrolDataService, useFactory: enrolDataServiceStub },
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
