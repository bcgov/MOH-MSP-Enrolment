import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AssistanceConfirmationComponent } from './confirmation.component';
import {LandingComponent} from '../../../../pages/landing/landing.component';
import { MspDataService } from '../../../../services/msp-data.service';
import {MspLogService} from '../../../../services/log.service';
import { HttpClientModule} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PageFrameworkComponent } from 'moh-common-lib-angular';


describe('AssistanceConfirmationComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceConfirmationComponent],
      imports: [FormsModule, HttpClientModule, PageFrameworkComponent,
      RouterModule.forRoot(
        [
          {
            path: 'msp',
            children: [
              {
                path: '',
                component: LandingComponent
              },
            ]
          }
        ]
      )],
      providers: [
        MspDataService,
        MspLogService,
        { provide: ActivatedRoute, useValue: { snapshot: { routeConfig: { path: '' } } } }
      ]
    });
  });
  it('should create', () => {
    const fixture = TestBed.createComponent(AssistanceConfirmationComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
