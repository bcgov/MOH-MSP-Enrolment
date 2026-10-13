import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactReviewCardComponent } from './contact-review-card.component';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { AddressReviewPartComponent } from '../address-review-part/address-review-part.component';
import { ReviewPartComponent } from '../review-part/review-part.component';

describe('ContactReviewCardComponent', () => {
  let component: ContactReviewCardComponent;
  let fixture: ComponentFixture<ContactReviewCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactReviewCardComponent,
        ReviewCardComponent,
        AddressReviewPartComponent,
        ReviewPartComponent
      ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactReviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the phone number in display format', () => {
    component.phoneNumber = '2143234323';
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Phone');
    expect(text).toContain('+1 (214) 323-4323');
  });

  it('shows the phone number in display format when the model holds the formatted value', () => {
    component.phoneNumber = '+1 (214) 323-4323';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('+1 (214) 323-4323');
  });

  it('shows no phone row when the phone number is empty', () => {
    component.phoneNumber = '';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Phone');
  });
});
