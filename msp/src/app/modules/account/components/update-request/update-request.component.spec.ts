import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent, CommonImage, NameComponent, RadioComponent } from 'moh-common-lib-angular';
import { UpdateRequestComponent } from './update-request.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { FormsModule } from '@angular/forms';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../models/relationship.enum';
import { MspLogService } from '../../../../services/log.service';
import { SupportDocumentList, SupportDocumentTypes } from '../../../msp-core/models/support-documents.enum';
import { StatusInCanada } from '../../../msp-core/models/canadian-status.enum';
import { SupportDocuments } from '../../../msp-core/models/support-documents.model';

describe('UpdateRequestComponent', () => {
  let component: UpdateRequestComponent;
  let fixture: ComponentFixture<UpdateRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRequestComponent ],
      imports: [
        FormsModule,
        MspCoreModule, CheckboxComponent, NameComponent, RadioComponent],
      providers: [{ provide: MspLogService, useValue: {} }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRequestComponent);
    component = fixture.componentInstance;
    component.person = new MspPerson(Relationship.Applicant);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggling an update option', () => {
    interface OptionCase {
      label: string;
      flag: string;
      docs: string[];
      list: () => SupportDocumentTypes[];
    }

    const cases: OptionCase[] = [
      { label: 'Update/renew status in Canada', flag: 'updateStatusInCanada', docs: ['updateStatusInCanadaDocType'], list: () => component.canadianCitizenDocList },
      { label: 'Update name - due to marriage or divorce', flag: 'updateNameDueToMarriage', docs: ['updateNameDueToMarriageDocType'], list: () => component.nameChangeDueToMarriageDocs },
      { label: 'Update name - due to name change', flag: 'updateNameDueToNameChange', docs: ['updateNameDueToNameChangeDocType'], list: () => component.nameChangeDueToNameChangeDocs },
      {
        label: 'Update gender designation - due to change',
        flag: 'updateGender',
        docs: ['updateGenderDocType', 'updateGenderDocType2', 'updateGenderDocType3'],
        list: () => component.genderChangeDocs
      },
      { label: 'Correct name - due to error', flag: 'updateNameDueToError', docs: ['updateNameDueToErrorDocType'], list: () => component.nameChangeDueToErrorDocs },
      { label: 'Correct birthdate - due to error', flag: 'updateBirthdate', docs: ['updateBirthdateDocType'], list: () => component.genderBirthdateChangeDocs },
      { label: 'Correct gender designation - due to error', flag: 'updateGenderDesignation', docs: ['updateGenderDesignationDocType'], list: () => component.genderBirthdateChangeDocs }
    ];
    const allDocKeys = cases.reduce((acc, c) => acc.concat(c.docs), [] as string[]);
    const docTypes = Object.keys(SupportDocumentList).map(k => SupportDocumentList[k]);

    // The child uploader drops a doc type that is not in its option's list, so seed a valid one.
    function validType(key: string): string {
      const owner = cases.find(c => c.docs.indexOf(key) >= 0);
      return docTypes[owner.list()[0]];
    }

    // Every option gets a doc type and one or two files; counts differ per
    // document so a wrong clear cannot cancel out in the total.
    function seed(person: MspPerson) {
      person.status = StatusInCanada.CitizenAdult;
      allDocKeys.forEach((key, i) => {
        const doc: SupportDocuments = person[key];
        doc.documentType = validType(key);
        doc.images = (i % 2 === 0) ? [new CommonImage()] : [new CommonImage(), new CommonImage()];
      });
      cases.forEach(c => (person[c.flag] = true));
      person.updateGenderAdditionalDocs = true;
      person.updateGenderAdditionalDocs2 = true;
      person.updateNameDueToMarriageRequestedLastName = 'Smith';
      // A document outside every option, so the total catches an over-broad clear.
      person.documents.images = [new CommonImage()];
    }

    function checkboxInput(label: string): HTMLInputElement {
      const boxes: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('common-checkbox'));
      const box = boxes.find(b => b.textContent.trim() === label);
      expect(box).withContext('checkbox "' + label + '" rendered').toBeTruthy();
      return box.querySelector('input[type=checkbox]');
    }

    async function settle() {
      fixture.detectChanges();
    }

    async function click(label: string) {
      checkboxInput(label).click();
      await settle();
    }

    function fileCount(person: MspPerson, keys: string[]): number {
      return keys.reduce((n, key) => n + person[key].images.length, 0);
    }

    cases.forEach(c => {
      it('clears only "' + c.label + '" files and doc type when its checkbox is unchecked', async () => {
        seed(component.person);
        await settle();
        const person = component.person;
        const before = person.getAllImages().length;
        const optionFiles = fileCount(person, c.docs);
        const otherKeys = allDocKeys.filter(k => c.docs.indexOf(k) < 0);
        const otherFiles = fileCount(person, otherKeys);
        expect(optionFiles).toBeGreaterThan(0);

        expect(checkboxInput(c.label).checked).withContext('checkbox starts checked').toBe(true);
        await click(c.label);

        expect(person[c.flag]).toBe(false);
        c.docs.forEach(key => {
          expect(person[key].images.length).withContext(key + ' images').toBe(0);
          expect(person[key].documentType).withContext(key + ' documentType').toBeNull();
        });
        expect(person.getAllImages().length).toBe(before - optionFiles);
        expect(fileCount(person, otherKeys)).toBe(otherFiles);
        otherKeys.forEach(key => expect(person[key].documentType).withContext(key + ' documentType').toBe(validType(key)));
      });

      it('keeps "' + c.label + '" files and doc type when its checkbox is checked', async () => {
        // Checking only sets the flag; it never clears documents.
        seed(component.person);
        const person = component.person;
        person[c.flag] = false;
        await settle();
        const before = person.getAllImages().length;

        expect(checkboxInput(c.label).checked).withContext('checkbox starts unchecked').toBe(false);
        await click(c.label);

        expect(person[c.flag]).toBe(true);
        expect(person.getAllImages().length).toBe(before);
        c.docs.forEach(key => expect(person[key].documentType).toBe(validType(key)));
      });
    });

    it('clears the gender additional-docs flags when gender is unchecked', async () => {
      seed(component.person);
      await settle();

      await click('Update gender designation - due to change');

      expect(component.person.updateGenderAdditionalDocs).toBeNull();
      expect(component.person.updateGenderAdditionalDocs2).toBeNull();
    });

    it('clears the requested last name when marriage is unchecked', async () => {
      seed(component.person);
      await settle();

      await click('Update name - due to marriage or divorce');

      // Pins the existing last-name reset; the marriage docs are covered by the table tests above.
      expect(component.person.updateNameDueToMarriageRequestedLastName).toBe('');
    });

    it('shows an empty doc type again after uncheck then re-check', async () => {
      seed(component.person);
      await settle();

      await click('Correct birthdate - due to error');
      await click('Correct birthdate - due to error');

      expect(component.person.updateBirthdate).toBe(true);
      expect(component.person.updateBirthdateDocType.documentType).toBeNull();
      expect(component.person.updateBirthdateDocType.images.length).toBe(0);
    });
  });
});
