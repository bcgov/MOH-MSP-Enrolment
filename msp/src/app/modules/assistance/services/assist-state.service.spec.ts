import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssistStateService } from './assist-state.service';
import { MspDataService } from '../../../services/msp-data.service';
import { MspLogService } from 'app/services/log.service';

describe('AssistStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      HttpClientTestingModule
    ],
    providers: [
      MspDataService,
      MspLogService
    ]
  }));

  it('should be created', () => {
    const service: AssistStateService = TestBed.inject(AssistStateService);
    expect(service).toBeTruthy();
  });
});
