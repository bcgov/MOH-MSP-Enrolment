import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressComponent, DateComponent, DuplicateCheckDirective, NameComponent, PageSectionComponent, PhnComponent, RadioComponent } from 'moh-common-lib-angular';
import { FormsModule } from '@angular/forms';
import { RemoveChildComponent } from './remove-child.component';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MspLogService } from '../../../../../services/log.service';

describe('RemoveChildComponent', () => {
  let component: RemoveChildComponent;
  let fixture: ComponentFixture<RemoveChildComponent>;

  beforeEach(waitForAsync(() => {
    const mspLogServiceStub = () => ({ log: () => undefined });
    TestBed.configureTestingModule({
      declarations: [
        AccountPersonalInformationComponent,
        RemoveChildComponent
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule, AddressComponent, DateComponent, DuplicateCheckDirective, NameComponent, PageSectionComponent, PhnComponent, RadioComponent],
      providers: [
        MspAccountMaintenanceDataService,
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveChildComponent);
    component = fixture.componentInstance;
    component.child = new MspPerson(Relationship.Child18To24);
    component.phns = [''];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
});
