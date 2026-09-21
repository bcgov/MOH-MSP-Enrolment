import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AssistanceReviewComponent } from './review.component';
import { MspDataService } from '../../../../services/msp-data.service';
import {RouterTestingModule} from '@angular/router/testing';
import {MspLogService} from '../../../../services/log.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import {HttpClientModule} from '@angular/common/http';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { PageSectionComponent } from 'moh-common-lib-angular';

describe('AssistanceReviewComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceReviewComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientModule,
        ModalModule.forRoot(),
        MspCoreModule,
        PageSectionComponent
      ],
      providers: [
        MspDataService,
        MspLogService
      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(AssistanceReviewComponent);
    expect(fixture.componentInstance instanceof AssistanceReviewComponent).toBe(true, 'should create AssistanceReviewComponent');
  });
});
