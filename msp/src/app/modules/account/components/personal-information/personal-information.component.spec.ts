import { AccountPersonalInformationComponent, IPersonalInformation } from './personal-information.component';
import { Relationship } from '../../../../models/relationship.enum';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { createTestingModule } from '../../../../_developmentHelpers/test-helpers';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DateComponent, DuplicateCheckDirective, NameComponent, PageSectionComponent, PhnComponent } from 'moh-common-lib-angular';

class Person1 implements IPersonalInformation {

  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  relationship: Relationship;
  hasActiveMedicalServicePlan: boolean;
  immigrationStatusChange: boolean;
}
@Component({
  standalone: false,
  template: ``,
})
class PersonalInfoComponent {

  @ViewChildren(AccountPersonalInformationComponent) personalInfo: QueryList<AccountPersonalInformationComponent<Person1>>;

  applicant1: Person1 = new Person1();

  sectionTitle = 'Personal Information';
  sectionInstructions = 'Enter your legal name and gender.';
}

describe('PersonalInformationComponent', () => {

  describe('Mandatory fields (no properities set)', () => {

    let component: PersonalInfoComponent;
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
      fixture = createTestingModule( PersonalInfoComponent,
         `<account-personal-information [(person)]="applicant1">
            <div sectionTitleInfo>
              <h2>{{sectionTitle}}</h2>
              <p class="border-bottom">
                {{sectionInstructions}}
              </p>
            </div>
          </account-personal-information>`,
          AccountPersonalInformationComponent
      );
      component = fixture.componentInstance;
    });

    it('should create (mandatory fields)', () => {
      const el = fixture.nativeElement;
      expect( component ).toBeTruthy();

      expect( el.querySelector( 'h2' ).textContent).toMatch( component.sectionTitle );
      expect( el.querySelector( 'p' ).textContent ).toMatch( component.sectionInstructions );
      expect( el.querySelectorAll( 'common-name' ).length ).toBe( 3 ); // First, Middle, Last name inputs - mandatory
      expect( el.querySelectorAll( 'common-date' ).length ).toBe( 1 ); // DOB input - mandatory
    });
  });

  // Built against a direct TestBed configuration (not the shared createTestingModule
  // helper) because that helper does not currently declare DuplicateCheckDirective,
  // which the app template's [commonDuplicateCheck][dupList] on <common-phn> needs to
  // compile. That gap is pre-existing and outside this task's scope.
  describe('[errorMessage] template binding on <common-phn>', () => {

    @Component({
      standalone: false,
      template: `<form>
        <account-personal-information [(person)]="applicant1"></account-personal-information>
      </form>`,
    })
    class PhnHostComponent {
      @ViewChildren(AccountPersonalInformationComponent) personalInfo: QueryList<AccountPersonalInformationComponent<Person1>>;
      applicant1: Person1 = new Person1();
    }

    let fixture: ComponentFixture<PhnHostComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PhnHostComponent, AccountPersonalInformationComponent],
        imports: [FormsModule, DateComponent, NameComponent, PageSectionComponent, PhnComponent, DuplicateCheckDirective],
      }).compileComponents();
      fixture = TestBed.createComponent(PhnHostComponent);
      fixture.detectChanges();
    });

    it('propagates phnErrorMsg into the rendered common-phn, overriding the library default duplicate copy', () => {
      const phnDebugEl = fixture.debugElement.query( By.directive( PhnComponent ) );
      const phnComponent = phnDebugEl.componentInstance as PhnComponent;

      // The library's own default duplicate message is generic:
      // `${label} was already used for another family member.` If the
      // [errorMessage] binding were not reaching the child, _defaultErrMsg
      // would still hold that generic text instead of the app's copy.
      const personalInfoComponent = fixture.componentInstance.personalInfo.first;
      expect( phnComponent.errorMessage ).toBe( personalInfoComponent.phnErrorMsg );
      expect( ( phnComponent as any )._defaultErrMsg.duplicate ).toBe(
        'This Personal Health Number (PHN) was already used for another family member. ' +
        'Please provide the PHN that is listed on the family member\'s PHN card/letter.'
      );
    });
  });
});
