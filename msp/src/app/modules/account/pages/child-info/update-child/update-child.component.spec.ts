import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { subYears, startOfToday } from 'date-fns';
import {
  AddressComponent, CheckboxComponent, DateComponent, DuplicateCheckDirective, ErrorContainerComponent,
  NameComponent, PageSectionComponent, PhnComponent, RadioComponent
} from 'moh-common-lib-angular';
import { UpdateChildComponent } from './update-child.component';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { MspCoreModule } from '../../../../msp-core/msp-core.module';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';
import { MspLogService } from '../../../../../services/log.service';

describe('UpdateChildComponent', () => {
  let component: UpdateChildComponent;
  let fixture: ComponentFixture<UpdateChildComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        UpdateChildComponent,
        AccountPersonalInformationComponent
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MspCoreModule, AddressComponent, CheckboxComponent, DateComponent, DuplicateCheckDirective,
        ErrorContainerComponent, NameComponent, PageSectionComponent, PhnComponent, RadioComponent],
      providers: [
        MspAccountMaintenanceDataService,
        { provide: MspLogService, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateChildComponent);
    component = fixture.componentInstance;
    component.child = new MspPerson(Relationship.Applicant);
    component.phns = [''];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('DPSS status mirroring (fullTimeStudent)', () => {
    it('mirrors fullTimeStudent to true when the DPSS checkbox is checked', () => {
      component.updateChildStatusToDPSS(true);

      expect(component.child.updateChildStatus).toBe(true);
      expect(component.child.fullTimeStudent).toBe(true);
    });

    it('mirrors fullTimeStudent to false when the DPSS checkbox is unchecked', () => {
      component.child.updateChildStatus = true;
      component.child.fullTimeStudent = true;

      component.updateChildStatusToDPSS(false);

      expect(component.child.updateChildStatus).toBe(false);
      expect(component.child.fullTimeStudent).toBe(false);
    });
  });

  describe('DPSS age-eligibility re-enforcement on birthdate change', () => {
    it('clears the DPSS status, fullTimeStudent, and school fields when an edited birthdate moves the child out of the 18-24 band', () => {
      // Put the child inside the 18-24 band, check the DPSS box, and fill in
      // a school field - mirrors a user who ticked the box while eligible.
      component.child.dob = subYears(startOfToday(), 20);
      component.updateChildStatusToDPSS(true);
      component.child.schoolName = 'UBC';
      fixture.detectChanges();

      // Edit the birthdate the way the page does it: through
      // account-personal-information's editable birthdate field, which
      // mutates the shared `child` object and emits (personChange).
      component.child.dob = subYears(startOfToday(), 10);
      const personalInfo = fixture.debugElement.query(By.directive(AccountPersonalInformationComponent));
      personalInfo.componentInstance.personChange.emit(component.child);

      expect(component.child.updateChildStatus).toBe(false);
      expect(component.child.fullTimeStudent).toBe(false);
      expect(component.child.schoolName).toBeNull();
    });

    it('leaves DPSS status untouched when an edited birthdate stays inside the 18-24 band', () => {
      component.child.dob = subYears(startOfToday(), 20);
      component.updateChildStatusToDPSS(true);
      component.child.schoolName = 'UBC';
      fixture.detectChanges();

      component.child.dob = subYears(startOfToday(), 19);
      const personalInfo = fixture.debugElement.query(By.directive(AccountPersonalInformationComponent));
      personalInfo.componentInstance.personChange.emit(component.child);

      expect(component.child.updateChildStatus).toBe(true);
      expect(component.child.fullTimeStudent).toBe(true);
      expect(component.child.schoolName).toBe('UBC');
    });
  });
});
