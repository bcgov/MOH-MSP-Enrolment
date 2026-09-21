import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AddressComponent, DateComponent, DuplicateCheckDirective, NameComponent, PageSectionComponent, PhnComponent, RadioComponent } from 'moh-common-lib-angular';
import { RemoveSpouseComponent } from './remove-spouse.component';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { MspCoreModule } from '../../../../msp-core/msp-core.module';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MspLogService } from '../../../../../services/log.service';

describe('RemoveSpouseComponent', () => {
  let component: RemoveSpouseComponent;
  let fixture: ComponentFixture<RemoveSpouseComponent>;

  beforeEach(waitForAsync(() => {
    const mspLogServiceStub = () => ({ log: () => undefined });
    TestBed.configureTestingModule({
      declarations: [
        RemoveSpouseComponent,
        AccountPersonalInformationComponent
      ],
      imports: [
        FormsModule,
        MspCoreModule,
        HttpClientTestingModule, AddressComponent, DateComponent, DuplicateCheckDirective, NameComponent, PageSectionComponent, PhnComponent, RadioComponent],
      providers: [
        MspAccountMaintenanceDataService,
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveSpouseComponent);
    component = fixture.componentInstance;
    component.spouse = new MspPerson(Relationship.Spouse);
    component.phns = [''];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
