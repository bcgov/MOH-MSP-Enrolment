import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ConsentModalComponent, PageStateService } from 'moh-common-lib-angular';
import { SpaEnvService } from '../../../../services/spa-env.service';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { Router } from '@angular/router';
import { MspAccountApp } from '../../models/account.model';
import { HeaderService } from '../../../../services/header.service';
import { environment } from 'environments/environment';
import { MspApiAccountService } from '../../services/msp-api-account.service';
import { ApiResponse } from '../../../../models/api-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { MspLogService } from '../../../../services/log.service';
import devOnlyConsoleLog from 'app/_developmentHelpers/dev-only-console-log';

@Component({
  standalone: false,
  selector: 'msp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  static ProcessStepNum = 0;
  public addressChangeLabel = 'Update Address';
  mspAccountApp: MspAccountApp;
  captchaApiBaseUrl: string = environment.appConstants.captchaApiBaseUrl;
  addressChangeBCUrl: string;
  @ViewChild('mspConsentModal', { static: true }) mspConsentModal: ConsentModalComponent;
  showAddressChangeCaptcha = false;
  showMoveCaptcha = false;
  outLinkTitle: string;
  outLinkUrl: string;
  continueButtonLoading = false;
  addressAppSent = false;
  isUnderMaintenance = false;
  maintenanceMessage = '';

  constructor(
    private dataService: MspAccountMaintenanceDataService,
    private header: HeaderService,
    private pageStateService: PageStateService,
    private apiService: MspApiAccountService,
    private router: Router,
    private logService: MspLogService,
    private spaEnvService: SpaEnvService
  ) {
    this.header.setTitle('Account Management');
    this.pageStateService.setPageComplete();
  }

  ngOnInit() {
    this.mspAccountApp = this.dataService.getMspAccountApp();
    this.spaEnvService.checkMaintenance('ACL').subscribe(check => {
      this.isUnderMaintenance = check.isUnderMaintenance;
      this.maintenanceMessage = check.message;
    });
  }

  ngAfterViewInit() {
    if (!this.mspAccountApp.infoCollectionAgreement) {
      this.mspConsentModal.showFullSizeView();
    }
  }
  onAccept(event: boolean) {
    this.mspAccountApp.infoCollectionAgreement = event;
    this.dataService.saveMspAccountApp();
  }

  onClickAddressChange() {
    this.outLinkTitle = 'Address Change BC';
    this.outLinkUrl = 'http://www.addresschange.gov.bc.ca/';
    this.showAddressChangeCaptcha = false;
    this.showMoveCaptcha = false;
    this.mspAccountApp.authorizationToken = null;

    setTimeout(() => {
      this.showAddressChangeCaptcha = true;
    }, 50);
  }

  onClickMove() {
    this.outLinkTitle = 'Move Outside BC';
    this.outLinkUrl = 'http://www.health.gov.bc.ca/exforms/msp/7063.html';
    this.showAddressChangeCaptcha = false;
    this.showMoveCaptcha = false;
    this.mspAccountApp.authorizationToken = null;

    setTimeout(() => {
      this.showMoveCaptcha = true;
    }, 50);
  }

  continue() {
    this.continueButtonLoading = true;
    // On users first address change request, send notice
    if (!this.addressAppSent) {
      this.apiService
        .sendChangeAddressApplication(this.mspAccountApp)
        .then((response: ApiResponse) => {
          if (response) {
            devOnlyConsoleLog('Submission response: ', response.op_return_code);
          }

          if (response instanceof HttpErrorResponse) {
            this.logService.log(
              {
                name: 'Account - System Error',
                confirmationNumber: this.mspAccountApp.referenceNumber,
                url: this.router.url,
              },
              'Account - Submission Response Error' + response.message
            );
          }

          this.addressAppSent = true;
        })
        .catch((error: ResponseType | any) => {
          devOnlyConsoleLog('Account - Error in sending request: ', error);
        });
    }
    this.continueButtonLoading = false;
    window.open(this.outLinkUrl, '_blank');
  }
}
