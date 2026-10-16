import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { subYears, startOfToday } from 'date-fns';
import {
  AddressComponent, CheckboxComponent, CommonImage, DateComponent, DuplicateCheckDirective, ErrorContainerComponent,
  NameComponent, PageSectionComponent, PhnComponent, RadioComponent
} from 'moh-common-lib-angular';
import { UpdateChildComponent } from './update-child.component';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { MspCoreModule } from '../../../../msp-core/msp-core.module';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';
import { MspLogService } from '../../../../../services/log.service';
import { SupportDocumentList } from '../../../../msp-core/models/support-documents.enum';
import { StatusInCanada } from '../../../../msp-core/models/canadian-status.enum';

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

  describe('phnList and duplicate PHN', () => {
    const AH_PHN = '9999 999 998';
    const OWN_PHN = '9999 999 973';
    const DUPLICATE_MESSAGE = 'This Personal Health Number (PHN) was already used for another family member. ' +
      'Please provide the PHN that is listed on the family member\'s PHN card/letter.';

    // Same rule as the parent page's phns getter: the account holder first, then this person once the PHN is long enough.
    function listedPhns(): string[] {
      return [AH_PHN, component.child.phn].filter(p => p && p.length >= 10);
    }

    function render() {
      component.phns = listedPhns();
      fixture.detectChanges();
    }

    function typePhn(value: string) {
      const input: HTMLInputElement = fixture.nativeElement.querySelector('common-phn input');
      input.value = value;
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('change'));
      input.dispatchEvent(new Event('blur'));
      component.phns = listedPhns();
      fixture.detectChanges();
    }

    it('keeps the account holder PHN while the own PHN is partial', () => {
      component.phns = [AH_PHN];
      component.child.phn = '99999';
      expect(component.phnList).toEqual([AH_PHN]);
    });

    it('keeps the account holder PHN while the own PHN is not entered', () => {
      component.phns = [AH_PHN];
      component.child.phn = undefined;
      expect(component.phnList).toEqual([AH_PHN]);
    });

    // Pins the existing own-entry removal; it also passes without the guard.
    it('drops only the own PHN once it is listed', () => {
      component.phns = [AH_PHN, OWN_PHN];
      component.child.phn = OWN_PHN;
      expect(component.phnList).toEqual([AH_PHN]);
    });

    it('flags the account holder PHN typed into the rendered field and clears it for a unique PHN', () => {
      render();
      const field: HTMLElement = fixture.nativeElement.querySelector('common-phn');

      typePhn(AH_PHN);
      expect(field.classList.contains('ng-invalid')).toBeTrue();
      expect(field.textContent.replace(/\s+/g, ' ')).toContain(DUPLICATE_MESSAGE);

      typePhn(OWN_PHN);
      expect(field.classList.contains('ng-invalid')).toBeFalse();
      expect(field.textContent.replace(/\s+/g, ' ')).not.toContain(DUPLICATE_MESSAGE);
    });
  });

  describe('second and third gender document questions', () => {
    const docTypes = Object.keys(SupportDocumentList).map(k => SupportDocumentList[k]);

    function files(count: number): CommonImage[] {
      return Array.from({ length: count }, () => new CommonImage());
    }

    // Documents 1, 2 and 3 hold 1, 2 and 3 files; one more file sits outside the gender documents.
    function seed() {
      const child = component.child;
      const validType = docTypes[component.genderChangeDocs[0]];
      child.status = StatusInCanada.CitizenAdult;
      child.updateGender = true;
      child.updateGenderAdditionalDocs = true;
      child.updateGenderAdditionalDocs2 = true;
      [child.updateGenderDocType, child.updateGenderDocType2, child.updateGenderDocType3].forEach((doc, i) => {
        doc.documentType = validType;
        doc.images = files(i + 1);
      });
      child.documents.images = files(1);
      fixture.detectChanges();
    }

    // Clicks the "No" radio of the common-radio whose legend matches the label text.
    function clickNo(legendText: string) {
      const fieldset = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('fieldset'))
        .find(f => (f.querySelector('legend')?.textContent || '').includes(legendText));
      expect(fieldset).withContext('radio "' + legendText + '" rendered').toBeTruthy();
      fieldset.querySelector<HTMLInputElement>('input[type=radio][id^="false_"]').click();
      fixture.detectChanges();
    }

    it('drops the third document when the user clicks No on the third document question', () => {
      seed();
      const child = component.child;
      expect(child.getAllImages().length).toBe(7);

      clickNo('Do you need to add a third document?');

      expect(child.updateGenderAdditionalDocs2).toBeFalse();
      expect(child.updateGenderDocType3.images.length).toBe(0);
      expect(child.updateGenderDocType3.documentType).toBeNull();
      expect(child.updateGenderAdditionalDocs).toBeTrue();
      expect(child.updateGenderDocType.images.length).toBe(1);
      expect(child.updateGenderDocType2.images.length).toBe(2);
      expect(child.getAllImages().length).toBe(4);
    });

    it('drops the second and third documents when the user clicks No on the second document question', () => {
      seed();
      const child = component.child;

      clickNo('Do you need to add a second document?');

      expect(child.updateGenderAdditionalDocs).toBeFalse();
      expect(child.updateGenderAdditionalDocs2).toBeNull();
      expect(child.updateGenderDocType2.images.length).toBe(0);
      expect(child.updateGenderDocType2.documentType).toBeNull();
      expect(child.updateGenderDocType3.images.length).toBe(0);
      expect(child.updateGenderDocType3.documentType).toBeNull();
      expect(child.updateGenderDocType.images.length).toBe(1);
      expect(child.getAllImages().length).toBe(2);
    });
  });
});
