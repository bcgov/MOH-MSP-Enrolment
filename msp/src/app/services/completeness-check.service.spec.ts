import {TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import { CompletenessCheckService } from './completeness-check.service';
import { MspDataService } from './msp-data.service';
import { LocalStorageService } from './local-storage.service';

describe('PHN Component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [BrowserModule,
        CommonModule,
        FormsModule,
],
      providers: [
        CompletenessCheckService, MspDataService,
        LocalStorageService]
    });
  });

  // NOTE (msp Angular 19 migration): this describe block previously had its
  // only test commented out (referencing undeclared `service`/`validationService`
  // variables, so it could never have compiled as-is) and Jasmine tolerated the
  // resulting empty describe silently. Jasmine 5's runner now hard-fails on an
  // empty describe, which aborted the entire suite. Restored to a minimal DI
  // smoke test so the suite can run; the real PHN validation coverage that used
  // to be sketched out here still needs to be written - flagged for Amber.
  it('should create', () => {
    expect(TestBed.inject(CompletenessCheckService)).toBeTruthy();
  });
});
