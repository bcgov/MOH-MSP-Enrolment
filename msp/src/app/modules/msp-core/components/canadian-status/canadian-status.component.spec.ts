import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanadianStatusComponent, ICanadianStatus } from './canadian-status.component';
import { PageSectionComponent, RadioComponent } from 'moh-common-lib-angular';
import { FormsModule } from '@angular/forms';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../models/relationship.enum';

describe('CanadianStatusComponent', () => {
  let component: CanadianStatusComponent<ICanadianStatus>;
  let fixture: ComponentFixture<CanadianStatusComponent<ICanadianStatus>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CanadianStatusComponent ],
      imports: [FormsModule, PageSectionComponent, RadioComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanadianStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.person = new MspPerson(Relationship.Applicant);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
