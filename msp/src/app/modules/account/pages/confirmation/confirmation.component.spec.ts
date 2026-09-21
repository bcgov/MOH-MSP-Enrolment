import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmTemplateComponent, PageFrameworkComponent, PageSectionComponent } from 'moh-common-lib-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountConfirmationComponent } from './confirmation.component';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';

describe('AccountConfirmationComponent', () => {
  let component: AccountConfirmationComponent;
  let fixture: ComponentFixture<AccountConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountConfirmationComponent ],
      imports: [
        RouterTestingModule, ConfirmTemplateComponent, PageFrameworkComponent, PageSectionComponent],
      providers: [
        MspAccountMaintenanceDataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
