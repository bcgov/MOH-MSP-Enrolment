import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspAddressCardPartComponent } from './address-card-part.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

describe('MspAddressCardPartComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspAddressCardPartComponent],
      imports: [FormsModule, TypeaheadModule,],
      providers: [MspDataService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspAddressCardPartComponent);
    expect(fixture.componentInstance instanceof MspAddressCardPartComponent).toBe(true, 'should create MspAddressCardPartComponent');

  });
});
