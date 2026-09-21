import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AssistancePersonalInfoComponent } from './personal-info.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MspLogService } from '../../../../services/log.service';
import { HttpClientModule } from '@angular/common/http';
import { AssistCraDocumentsComponent } from '../../components/assist-cra-documents/assist-cra-documents.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { PageSectionComponent } from 'moh-common-lib-angular';

describe('AssistancePersonalInfoComponent Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AssistancePersonalInfoComponent,
        AssistCraDocumentsComponent
      ],
      imports: [
        FormsModule,
        TypeaheadModule,
        ModalModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        MspCoreModule,
        PageSectionComponent
      ],
      providers: [MspDataService, CompletenessCheckService, MspLogService]
    });
  });
  it('should work', () => {
    const fixture = TestBed.createComponent(AssistancePersonalInfoComponent);
    expect(
      fixture.componentInstance instanceof AssistancePersonalInfoComponent
    ).toBe(true, 'should create AssistancePersonalInfoComponent');
  });
});
