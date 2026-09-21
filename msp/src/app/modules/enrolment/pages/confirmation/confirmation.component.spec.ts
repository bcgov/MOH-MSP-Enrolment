import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ConfirmationComponent } from './confirmation.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspLogService } from '../../../../services/log.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import { ConfirmTemplateComponent, PageFrameworkComponent, PageSectionComponent } from 'moh-common-lib-angular';

describe('Component Test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationComponent],
      imports: [
        HttpClientModule, RouterModule, RouterTestingModule,
        ConfirmTemplateComponent, PageFrameworkComponent, PageSectionComponent
      ],
      providers: [
        MspDataService,
        MspLogService,
        { provide: ActivatedRoute, useValue: { snapshot: { routeConfig: { path: '' } } } }
      ]
    });
  });
  it('should create', () => {
    const fixture = TestBed.createComponent(ConfirmationComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
