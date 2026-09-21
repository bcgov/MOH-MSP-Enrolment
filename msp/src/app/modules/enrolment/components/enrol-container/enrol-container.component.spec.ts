import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreBreadcrumbComponent, WizardProgressBarComponent } from 'moh-common-lib-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { EnrolContainerComponent } from './enrol-container.component';
import { PageStateService } from '../../../../services/page-state.service';

describe('EnrolContainerComponent', () => {
  let component: EnrolContainerComponent;
  let fixture: ComponentFixture<EnrolContainerComponent>;
  const pageStateServiceStub = () => ({
    setPages: () => ({})
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrolContainerComponent ],
      imports: [
        RouterTestingModule, CoreBreadcrumbComponent, WizardProgressBarComponent],
      providers: [
        { provide: PageStateService, useFactory: pageStateServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
