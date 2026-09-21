import {ChangeDetectorRef, Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {BaseComponent} from '../../../../models/base.component';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {ConsentModalComponent} from 'moh-common-lib-angular';
import {Router} from '@angular/router';
import {SpaEnvService} from '../../../../services/spa-env.service';

@Component({
  standalone: false,
  selector: 'msp-eligibility',
  templateUrl: './eligibility.component.html',
  styleUrls: ['./eligibility.component.scss']
})
export class EligibilityComponent extends BaseComponent implements OnInit, AfterViewInit {

  continue: boolean;
  isUnderMaintenance = false;
  maintenanceMessage = '';

  @ViewChild('mspConsentModal', { static: true }) mspConsentModal: ConsentModalComponent;

  constructor(
    private _router: Router,
    public dataService: MspBenefitDataService,
    private spaEnvService: SpaEnvService,
    cd: ChangeDetectorRef
  ) {
                super(cd);

  }

  ngOnInit() {
    super.ngOnInit();
    this.spaEnvService.checkMaintenance('SUPPBEN').subscribe(check => {
      this.isUnderMaintenance = check.isUnderMaintenance;
      this.maintenanceMessage = check.message;
      this.benefitApp.spaEnvRes = check.response;
    });
  }

  ngAfterViewInit() {
    if (!this.dataService.benefitApp.infoCollectionAgreement) {
        this.mspConsentModal.showFullSizeView();
    }
  }

  navigate() {
    if (this.dataService.benefitApp.isEligible) {
      this._router.navigate(['/benefit/financial-info']);
    } else {
      this._router.navigate(['/benefit/confirmation']);
    }
  }

  get benefitApp(): BenefitApplication {
    return this.dataService.benefitApp;
  }
}
