import {ChangeDetectorRef, Component, ViewChild, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { MspConsentModalComponent } from '../../../msp-core/components/consent-modal/consent-modal.component';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolForm } from '../../models/enrol-form';
import { EnrolDataService } from '../../services/enrol-data.service';
import { Enrollee } from '../../models/enrollee';
import { EnrolApplication } from '../../models/enrol-application';

@Component({
  standalone: false,
  templateUrl: './prepare.component.html'
})
export class PrepareComponent extends EnrolForm implements AfterViewInit {

  @ViewChild('mspConsentModal', { static: true }) mspConsentModal: MspConsentModalComponent;

  constructor( protected enrolDataService: EnrolDataService,
               protected pageStateService: PageStateService,
               protected router: Router,
               private changeDetectorRef: ChangeDetectorRef ) {
    super( enrolDataService, pageStateService, router );
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    if (!this.mspApplication.infoCollectionAgreement) {
      this.mspConsentModal.showFullSizeView();
      // showFullSizeView() opens the modal after its own first change-detection
      // pass already rendered closed (display: none), so [style.display] would
      // flip to 'block' during Angular's checkNoChanges pass. Re-run change
      // detection now so it settles before that comparison happens.
      this.changeDetectorRef.detectChanges();
    }
  }

  get application(): EnrolApplication  {
    return this.enrolDataService.application;
  }

  get applicant(): Enrollee {
    return this.application.applicant;
  }

  get liveInBC() {
    return this.application.liveInBC;
  }

  set liveInBC(live: boolean) {
    this.application.liveInBC = live;
  }

  get plannedAbsence() {
    return this.application.plannedAbsence;
  }

  set plannedAbsence(live: boolean) {
    this.application.plannedAbsence = live;
  }

  get unUsualCircumstance() {
    return this.application.unUsualCircumstance;
  }

  set unUsualCircumstance(live: boolean) {
    this.application.unUsualCircumstance = live;
  }

  acceptAgreement($event) {
    this.application.infoCollectionAgreement = $event;
    this.enrolDataService.saveApplication();
  }

  continue() {
    this._canContinue = super.canContinue() &&
                        this.plannedAbsence === false &&
                        this.liveInBC === true &&
                        this.unUsualCircumstance === false;

    this._nextUrl = ROUTES_ENROL.PERSONAL_INFO.fullpath;
    super.continue();
  }
}
