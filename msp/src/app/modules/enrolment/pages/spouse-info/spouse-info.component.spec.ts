import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent, FormActionBarComponent, PageFrameworkComponent, RadioComponent, XiconButtonComponent } from 'moh-common-lib-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SpouseInfoComponent } from './spouse-info.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { EnrolApplication } from '../../models/enrol-application';

describe('SpouseInfoComponent', () => {
  let component: SpouseInfoComponent;
  let fixture: ComponentFixture<SpouseInfoComponent>;
  const pageStateServiceStub = () => ({
    setPageIncomplete: () => ({})
  });
  const enrolDataServiceStub = () => ({
    application: new EnrolApplication()
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpouseInfoComponent ],
      imports: [
        FormsModule,
        MspCoreModule,
        RouterTestingModule, ButtonComponent, FormActionBarComponent, PageFrameworkComponent, RadioComponent, XiconButtonComponent],
      providers: [
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: EnrolDataService, useFactory: enrolDataServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpouseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
