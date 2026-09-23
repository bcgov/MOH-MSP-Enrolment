import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreBreadcrumbComponent, FormActionBarComponent, PageFrameworkComponent, WizardProgressBarComponent } from 'moh-common-lib-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssistContainerComponent } from './assist-container.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspLogService } from 'app/services/log.service';

describe('AssistContainerComponent', () => {
  let component: AssistContainerComponent;
  let fixture: ComponentFixture<AssistContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistContainerComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule, CoreBreadcrumbComponent, FormActionBarComponent, PageFrameworkComponent, WizardProgressBarComponent],
      providers: [
        MspDataService,
        MspLogService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
