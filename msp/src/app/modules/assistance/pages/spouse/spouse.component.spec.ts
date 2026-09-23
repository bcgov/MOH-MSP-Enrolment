import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorContainerComponent, FileUploaderComponent, PageSectionComponent } from 'moh-common-lib-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpouseComponent } from './spouse.component';
import { AssistCraDocumentsComponent } from '../../components/assist-cra-documents/assist-cra-documents.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspLogService } from 'app/services/log.service';

describe('SpouseComponent', () => {
  let component: SpouseComponent;
  let fixture: ComponentFixture<SpouseComponent>;
  const fakeActivatedRoute = {
    snapshot: {
      routeConfig: {
        path: ''
      }
    }
  } as ActivatedRoute;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpouseComponent,
        AssistCraDocumentsComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule, ErrorContainerComponent, FileUploaderComponent, PageSectionComponent],
      providers: [
        MspDataService,
        MspLogService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
