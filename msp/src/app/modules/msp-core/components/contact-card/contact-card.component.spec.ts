import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspContactCardComponent } from './contact-card.component';
import { MspDataService } from '../../../../services/msp-data.service';
import {RouterTestingModule} from '@angular/router/testing';
import { MspAddressCardPartComponent } from '../address-card-part/address-card-part.component';

describe('MspContactCardComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspContactCardComponent, MspAddressCardPartComponent],
      imports: [FormsModule, RouterTestingModule,],
      providers: [MspDataService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspContactCardComponent);
    expect(fixture.componentInstance instanceof MspContactCardComponent).toBe(true, 'should create MspContactCardComponent');

  });
});
