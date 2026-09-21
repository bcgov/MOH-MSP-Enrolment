import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { UpdateSpouseComponent } from './update-spouse.component';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { UpdateRequestComponent } from '../../../components/update-request/update-request.component';
import { MspCoreModule } from '../../../../msp-core/msp-core.module';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';
import {
  CheckboxComponent, DateComponent, DuplicateCheckDirective, NameComponent, PageSectionComponent, PhnComponent
} from 'moh-common-lib-angular';

describe('UpdateSpouseComponent', () => {
  let component: UpdateSpouseComponent;
  let fixture: ComponentFixture<UpdateSpouseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        UpdateSpouseComponent,
        AccountPersonalInformationComponent,
        UpdateRequestComponent
      ],
      imports: [
        FormsModule,
        MspCoreModule,
        CheckboxComponent, DateComponent, DuplicateCheckDirective, NameComponent, PageSectionComponent,
        PhnComponent
],
      providers: [
        MspAccountMaintenanceDataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSpouseComponent);
    component = fixture.componentInstance;
    component.spouse = new MspPerson(Relationship.Spouse);
    component.phns = [''];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
