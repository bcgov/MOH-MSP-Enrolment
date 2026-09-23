import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import {RouterTestingModule} from '@angular/router/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import {MspImageErrorModalComponent} from './image-error-modal.component';

describe('MspImageErrorModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspImageErrorModalComponent],
      imports: [FormsModule, RouterTestingModule, ModalModule.forRoot(),],
      providers: [MspDataService,


      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspImageErrorModalComponent);
    expect(fixture.componentInstance instanceof MspImageErrorModalComponent).toBe(true, 'should create MspImageErrorModalComponent');

  });
});
