import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonImage, DateComponent, DuplicateCheckDirective, ErrorContainerComponent, NameComponent, PageSectionComponent, PhnComponent, RadioComponent } from 'moh-common-lib-angular';
import { AddSpouseComponent } from './add-spouse.component';
import { MspCoreModule } from '../../../../msp-core/msp-core.module';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { ChildMovingInformationComponent } from '../../../components/moving-information/moving-information.component';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { SupportDocumentList } from '../../../../msp-core/models/support-documents.enum';
import { MspLogService } from '../../../../../services/log.service';
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
        MspCoreModule, DateComponent, ErrorContainerComponent, NameComponent, PageSectionComponent, PhnComponent, DuplicateCheckDirective, RadioComponent],
      providers: [
        MspAccountMaintenanceDataService,
        { provide: MspLogService, useValue: { log: () => undefined } }
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

  describe('name change uploads', () => {
    let nameChangeImg: CommonImage;
    let additionalImg: CommonImage;

    function populate() {
      nameChangeImg = new CommonImage();
      additionalImg = new CommonImage();
      component.spouse.hasNameChange = true;
      component.spouse.hasNameChangeAdditional = true;
      component.spouse.nameChangeDocs.documentType = SupportDocumentList.CanadianBirthCertificate;
      component.spouse.nameChangeDocs.images = [nameChangeImg];
      component.spouse.nameChangeAdditionalDocs.documentType = SupportDocumentList.ChangeOfNameCertificate;
      component.spouse.nameChangeAdditionalDocs.images = [additionalImg];
    }

    // Clicks the "No" radio of the common-radio whose legend matches the label text.
    function clickNo(legendText: string) {
      const fieldset = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('fieldset'))
        .find(f => (f.querySelector('legend')?.textContent || '').includes(legendText));
      expect(fieldset).toBeTruthy(`radio "${legendText}" is not rendered`);
      const no = fieldset.querySelector<HTMLInputElement>('input[type=radio][id^="false_"]');
      expect(no).toBeTruthy();
      no.click();
      fixture.detectChanges();
    }

    function render() {
      component.phns = [];
      component.spouse.immigrationStatusChange = false;
      fixture.detectChanges();
    }

    it('clears both uploads and the additional answer when the name change answer is No', () => {
      populate();
      expect(component.spouse.getAllImages()).toContain(nameChangeImg);
      expect(component.spouse.getAllImages()).toContain(additionalImg);

      component.onNameChangeAnswer(false);

      expect(component.spouse.nameChangeDocs.documentType).toBeNull();
      expect(component.spouse.nameChangeDocs.images).toEqual([]);
      expect(component.spouse.nameChangeAdditionalDocs.documentType).toBeNull();
      expect(component.spouse.nameChangeAdditionalDocs.images).toEqual([]);
      expect(component.spouse.hasNameChangeAdditional).toBeNull();
      expect(component.spouse.getAllImages()).not.toContain(nameChangeImg);
      expect(component.spouse.getAllImages()).not.toContain(additionalImg);
    });

    it('keeps everything when the name change answer is Yes', () => {
      populate();

      component.onNameChangeAnswer(true);

      expect(component.spouse.nameChangeDocs.documentType).toBe(SupportDocumentList.CanadianBirthCertificate);
      expect(component.spouse.nameChangeDocs.images).toEqual([nameChangeImg]);
      expect(component.spouse.nameChangeAdditionalDocs.documentType).toBe(SupportDocumentList.ChangeOfNameCertificate);
      expect(component.spouse.nameChangeAdditionalDocs.images).toEqual([additionalImg]);
      expect(component.spouse.hasNameChangeAdditional).toBeTrue();
    });

    it('clears only the additional upload when the additional answer is No', () => {
      populate();

      component.onNameChangeAdditionalAnswer(false);

      expect(component.spouse.nameChangeAdditionalDocs.documentType).toBeNull();
      expect(component.spouse.nameChangeAdditionalDocs.images).toEqual([]);
      expect(component.spouse.nameChangeDocs.documentType).toBe(SupportDocumentList.CanadianBirthCertificate);
      expect(component.spouse.nameChangeDocs.images).toEqual([nameChangeImg]);
      expect(component.spouse.hasNameChange).toBeTrue();
      expect(component.spouse.getAllImages()).toContain(nameChangeImg);
      expect(component.spouse.getAllImages()).not.toContain(additionalImg);
    });

    it('keeps the additional upload when the additional answer is Yes', () => {
      populate();

      component.onNameChangeAdditionalAnswer(true);

      expect(component.spouse.nameChangeAdditionalDocs.documentType).toBe(SupportDocumentList.ChangeOfNameCertificate);
      expect(component.spouse.nameChangeAdditionalDocs.images).toEqual([additionalImg]);
      expect(component.spouse.nameChangeDocs.images).toEqual([nameChangeImg]);
    });

    it('clears uploads when the user clicks No on the rendered name change question', () => {
      populate();
      render();

      clickNo('Has your spouse\'s name changed');

      expect(component.spouse.hasNameChange).toBeFalse();
      expect(component.spouse.nameChangeDocs.images).toEqual([]);
      expect(component.spouse.nameChangeAdditionalDocs.images).toEqual([]);
      expect(component.spouse.getAllImages()).not.toContain(nameChangeImg);
      expect(component.spouse.getAllImages()).not.toContain(additionalImg);
    });

    it('clears only the additional upload when the user clicks No on the rendered additional question', () => {
      populate();
      render();

      clickNo('Do you need to add an additional document?');

      expect(component.spouse.hasNameChangeAdditional).toBeFalse();
      expect(component.spouse.nameChangeAdditionalDocs.images).toEqual([]);
      expect(component.spouse.nameChangeDocs.images).toEqual([nameChangeImg]);
      expect(component.spouse.getAllImages()).not.toContain(additionalImg);
    });
  });
});
