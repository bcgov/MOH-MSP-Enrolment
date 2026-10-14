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
});
