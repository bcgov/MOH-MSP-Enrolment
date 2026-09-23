import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressComponent, DateComponent, DuplicateCheckDirective, NameComponent, PageSectionComponent, PhnComponent, RadioComponent } from 'moh-common-lib-angular';
import { FormsModule } from '@angular/forms';
import { RemoveChildComponent } from './remove-child.component';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MspLogService } from '../../../../../services/log.service';

describe('RemoveChildComponent', () => {
  let component: RemoveChildComponent;
  let fixture: ComponentFixture<RemoveChildComponent>;

  beforeEach(waitForAsync(() => {
    const mspLogServiceStub = () => ({ log: () => undefined });
    TestBed.configureTestingModule({
      declarations: [
        AccountPersonalInformationComponent,
        RemoveChildComponent
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule, AddressComponent, DateComponent, DuplicateCheckDirective, NameComponent, PageSectionComponent, PhnComponent, RadioComponent],
      providers: [
        MspAccountMaintenanceDataService,
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveChildComponent);
    component = fixture.componentInstance;
    component.child = new MspPerson(Relationship.Child18To24);
    component.phns = [''];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
