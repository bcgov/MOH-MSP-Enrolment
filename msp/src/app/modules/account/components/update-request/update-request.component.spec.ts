import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent, NameComponent, RadioComponent } from 'moh-common-lib-angular';
import { UpdateRequestComponent } from './update-request.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { FormsModule } from '@angular/forms';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../models/relationship.enum';

describe('UpdateRequestComponent', () => {
  let component: UpdateRequestComponent;
  let fixture: ComponentFixture<UpdateRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRequestComponent ],
      imports: [
        FormsModule,
        MspCoreModule, CheckboxComponent, NameComponent, RadioComponent]
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
});
