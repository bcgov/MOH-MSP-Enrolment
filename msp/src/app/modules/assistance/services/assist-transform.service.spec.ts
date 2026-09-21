import { TestBed } from '@angular/core/testing';
import { AssistTransformService } from './assist-transform.service';
import { MspDataService } from '../../../services/msp-data.service';

describe('AssistTransformService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
],
    providers: [
      MspDataService
    ]
  }));

  it('should be created', () => {
    const service: AssistTransformService = TestBed.inject(AssistTransformService);
    expect(service).toBeTruthy();
  });
});
