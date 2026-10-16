import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountPersonCardComponent } from './person-card.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../models/relationship.enum';
import {
  StatusInCanada,
  CanadianStatusReason,
  CanadianStatusReasonStrings,
} from '../../../msp-core/models/canadian-status.enum';
import { SupportDocuments } from '../../../msp-core/models/support-documents.model';
import { CommonImage } from 'moh-common-lib-angular';
import { parseISO } from 'date-fns';

describe('MspPersonCardComponent', () => {
  let fixture;
  let component;
  const routerStub = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountPersonCardComponent],
      imports: [
        FormsModule,
        ModalModule.forRoot(),
        RouterTestingModule,
        MspCoreModule,
      ],
      providers: [MspDataService, { provide: Router, useValue: routerStub }],
    });
    fixture = TestBed.createComponent(AccountPersonCardComponent);
    component = fixture.componentInstance;
    component.person = new MspPerson(Relationship.Applicant);
  });
  it('should work', () => {
    expect(component instanceof AccountPersonCardComponent).toBe(
      true,
      'should create MspPersonCardComponent'
    );
  });

  describe('editPersonalInfo', () => {
    it('should route to edit link route.', () => {
      component.editRouterLink = 'TEST';
      component.editPersonalInfo();
      expect(routerStub.navigate).toHaveBeenCalledWith(['TEST']);
    });
  });

  describe('statusInCanadaLabel', () => {
    it("should return the person's status in Canada.", () => {
      component.person.status = StatusInCanada.CitizenAdult;
      expect(component.statusInCanadaLabel).toEqual('Canadian citizen');
    });
  });

  describe('currentActivityLabel', () => {
    it('should return an empty string when `currentActivity` is undefined.', () => {
      expect(component.currentActivityLabel).toEqual('');
    });

    it('should return the correct current activity.', () => {
      [
        'LivingInBCWithoutMSP',
        'MovingFromProvince',
        'MovingFromCountry',
        'WorkingInBC',
        'StudyingInBC',
        'ReligiousWorker',
        'Diplomat',
        'Visiting',
      ].forEach((name) => {
        component.person.currentActivity = CanadianStatusReason[name];
        expect(component.currentActivityLabel).toEqual(
          '> ' + CanadianStatusReasonStrings[name]
        );
      });
    });
  });

  describe('hasDocumentAttached', () => {
    it("should return false when doesn't have attached documents.", () => {
      expect(component.hasDocumentAttached).toBe(false);
    });

    it('should return true when does have attached documents.', () => {
      spyOnProperty(component, 'documentCount').and.returnValue(10);
      expect(component.hasDocumentAttached).toBe(true);
    });
  });

  describe('documentCount', () => {
    it("should return 0 when doesn't have attached documents.", () => {
      expect(component.documentCount).toBe(0);
    });

    it('should return value when does have attached documents.', () => {
      component.person.updateStatusInCanadaDocType = new SupportDocuments();
      component.person.updateStatusInCanadaDocType.images.push(
        new CommonImage()
      );
      expect(component.documentCount).toBe(1);
      component.person.updateStatusInCanadaDocType.images.push(
        new CommonImage()
      );
      expect(component.documentCount).toBe(2);
    });
  });

  describe('movedFromLabel', () => {
    it("should return 'Moved from jurisdiction' when is temporary resident or is moving from country.", () => {
      component.person.status = StatusInCanada.TemporaryResident;
      expect(component.movedFromLabel).toEqual('Moved from jurisdiction');
      component.person.status = null;
      component.person.currentActivity = CanadianStatusReason.MovingFromCountry;
      expect(component.movedFromLabel).toEqual('Moved from jurisdiction');
    });

    it("should return 'Moved from province' for all other cases.", () => {
      expect(component.movedFromLabel).toEqual('Moved from province');
    });
  });

  describe('fileLabel', () => {
    it("should return 'File' documentCount is 1.", () => {
      spyOnProperty(component, 'documentCount').and.returnValue(1);
      expect(component.fileLabel).toEqual('File');
    });

    it("should return 'Files' documentCount is more than 1.", () => {
      spyOnProperty(component, 'documentCount').and.returnValue(2);
      expect(component.fileLabel).toEqual('Files');
    });
  });

  describe('document rows', () => {
    function docs(count: number): SupportDocuments {
      const d = new SupportDocuments();
      for (let i = 0; i < count; i++) {
        d.images.push(new CommonImage());
      }
      return d;
    }

    function documentRows(): string[] {
      fixture.detectChanges();
      const rows: HTMLElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('.row')
      );
      return rows
        .filter((r) => r.textContent.trim().startsWith('Documents'))
        .map((r) => r.textContent.replace(/\s+/g, ' ').trim());
    }

    it('should show one Documents row counting the name change and additional files with status files.', () => {
      component.person.updateStatusInCanadaDocType = docs(1);
      component.person.nameChangeDocs = docs(1);
      component.person.nameChangeAdditionalDocs = docs(1);
      expect(component.documentCount).toBe(3);
      expect(documentRows()).toEqual(['Documents 3 Files']);
    });

    it('should count the other update request files in the same row.', () => {
      component.person.updateStatusInCanadaDocType = docs(1);
      component.person.updateNameDueToMarriageDocType = docs(1);
      component.person.updateBirthdateDocType = docs(2);
      expect(component.documentCount).toBe(4);
      expect(component.fileLabel).toEqual('Files');
      expect(documentRows()).toEqual(['Documents 4 Files']);
    });

    it('should count exactly the files that getAllImages returns.', () => {
      component.person.updateStatusInCanadaDocType = docs(1);
      component.person.updateGenderDocType = docs(1);
      component.person.updateGenderDocType2 = docs(1);
      component.person.updateGenderDocType3 = docs(1);
      expect(component.documentCount).toBe(component.person.getAllImages().length);
      expect(documentRows()).toEqual(['Documents 4 Files']);
    });

    it('should return an empty label for zero files.', () => {
      expect(component.fileLabel).toEqual('');
      expect(documentRows()).toEqual([]);
    });

    it('should render one Documents row, directly below Status in Canada, counting status, gender and name change files.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.updateStatusInCanadaDocType = docs(1);
      component.person.updateGender = true;
      component.person.updateGenderDocType = docs(2);
      component.person.hasNameChange = true;
      component.person.nameChangeDocs = docs(1);
      fixture.detectChanges();

      const rows: string[] = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.row'))
        .map((r) => r.textContent.replace(/\s+/g, ' ').trim());
      const statusRow = rows.findIndex((r) => r.startsWith('Status in Canada'));

      expect(component.person.getAllImages().length).toBe(4);
      expect(rows.filter((r) => r.startsWith('Documents'))).toEqual(['Documents 4 Files']);
      expect(rows[statusRow + 1]).toEqual('Documents 4 Files');
    });
  });

  describe('movedFromProvinceOrCountry', () => {
    it("should return 'Canada' when given 'CAN'.", () => {
      component.person.currentActivity = CanadianStatusReason.MovingFromCountry;
      component.person.movedFromProvinceOrCountry = 'CAN';
      expect(component.movedFromProvinceOrCountry).toEqual('Canada');
    });

    it("should return 'British Columbia' when given 'BC'.", () => {
      component.person.movedFromProvinceOrCountry = 'BC';
      expect(component.movedFromProvinceOrCountry).toEqual('British Columbia');
    });
  });

  describe('formatDateField', () => {
    it("should return 'Canada' when given 'CAN'.", () => {
      expect(component.formatDateField(parseISO('2020-04-01'))).toEqual(
        'April 1, 2020'
      );
      expect(component.formatDateField(parseISO('2020-04-10'))).toEqual(
        'April 10, 2020'
      );
    });
  });

  describe('hasMarriageDate', () => {
    it('should return false when has no marriage date.', () => {
      expect(component.hasMarriageDate).toBe(false);
    });

    it('should return true when has marriage date and relationship is Spouse.', () => {
      component.person.marriageDate = parseISO('2020-04-01');
      component.person.relationship = Relationship.Spouse;
      expect(component.hasMarriageDate).toBe(true);
    });
  });

  describe('title', () => {
    it('should return custom title when one is defined.', () => {
      component.customTitle = 'Test';
      expect(component.title).toEqual('Test');
    });

    it('should return custom title when one is defined.', () => {
      component.person.relationship = Relationship.Spouse;
      expect(component.title).toEqual('Spouse Information');
    });
  });
});
