import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DateComponent, ErrorContainerComponent, NameComponent, RadioComponent } from 'moh-common-lib-angular';
import { AddSpouseComponent } from './add-spouse.component';
import { MspCoreModule } from '../../../../msp-core/msp-core.module';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { ChildMovingInformationComponent } from '../../../components/moving-information/moving-information.component';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';

describe('AddSpouseComponent', () => {
  let component: AddSpouseComponent;
  let fixture: ComponentFixture<AddSpouseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddSpouseComponent,
        AccountPersonalInformationComponent,
        ChildMovingInformationComponent
      ],
      imports: [
        FormsModule,
        MspCoreModule, DateComponent, ErrorContainerComponent, NameComponent, RadioComponent],
      providers: [
        MspAccountMaintenanceDataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSpouseComponent);
    component = fixture.componentInstance;
    component.spouse = new MspPerson(Relationship.Spouse);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
