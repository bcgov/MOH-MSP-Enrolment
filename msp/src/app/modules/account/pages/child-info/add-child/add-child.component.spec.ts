import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressComponent, CommonImage, DateComponent, DuplicateCheckDirective, ErrorContainerComponent, NameComponent, PageSectionComponent, PhnComponent, RadioComponent } from 'moh-common-lib-angular';
import { FormsModule } from '@angular/forms';
import { AddChildComponent } from './add-child.component';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { ChildMovingInformationComponent } from '../../../components/moving-information/moving-information.component';
import { MspCoreModule } from '../../../../msp-core/msp-core.module';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { SupportDocumentList } from '../../../../msp-core/models/support-documents.enum';
import { MspLogService } from '../../../../../services/log.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';

describe('AddChildComponent', () => {
  let component: AddChildComponent;
  let fixture: ComponentFixture<AddChildComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddChildComponent,
        AccountPersonalInformationComponent,
        ChildMovingInformationComponent
      ],
      imports: [
        FormsModule,
        MspCoreModule, AddressComponent, DateComponent, ErrorContainerComponent, NameComponent, PageSectionComponent, PhnComponent, DuplicateCheckDirective, RadioComponent],
      providers: [
        MspAccountMaintenanceDataService,
        { provide: MspLogService, useValue: { log: () => undefined } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChildComponent);
    component = fixture.componentInstance;
    component.child = new MspPerson(Relationship.Child18To24);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('name change uploads', () => {
    let img: CommonImage;
    let emitted: MspPerson[];

    beforeEach(() => {
      img = new CommonImage();
      emitted = [];
      component.personChange.subscribe((p: MspPerson) => emitted.push(p));
      component.child.hasNameChange = true;
      component.child.nameChangeDocs.documentType = SupportDocumentList.ChangeOfNameCertificate;
      component.child.nameChangeDocs.images = [img];
    });

    it('clears the upload and emits the child when the answer is No', () => {
      expect(component.child.getAllImages()).toContain(img);

      component.onNameChangeAnswer(false);

      expect(component.child.nameChangeDocs.documentType).toBeNull();
      expect(component.child.nameChangeDocs.images).toEqual([]);
      expect(component.child.getAllImages()).not.toContain(img);
      expect(emitted).toEqual([component.child]);
    });

    it('keeps the upload and still emits the child when the answer is Yes', () => {
      component.onNameChangeAnswer(true);

      expect(component.child.nameChangeDocs.documentType).toBe(SupportDocumentList.ChangeOfNameCertificate);
      expect(component.child.nameChangeDocs.images).toEqual([img]);
      expect(emitted).toEqual([component.child]);
    });

    it('clears the upload when the user clicks No on the rendered name change question', () => {
      component.phns = [];
      component.hasActiveMedicalCoverage = false;
      fixture.detectChanges();

      const fieldset = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('fieldset'))
        .find(f => (f.querySelector('legend')?.textContent || '').includes('name changed since'));
      expect(fieldset).toBeTruthy('name change radio is not rendered');
      fieldset.querySelector<HTMLInputElement>('input[type=radio][id^="false_"]').click();
      fixture.detectChanges();

      expect(component.child.hasNameChange).toBeFalse();
      expect(component.child.nameChangeDocs.images).toEqual([]);
      expect(component.child.getAllImages()).not.toContain(img);
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
      component.hasActiveMedicalCoverage = true;
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
});
