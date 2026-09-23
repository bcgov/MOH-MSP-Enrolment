import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ConsentModalComponent } from 'moh-common-lib-angular';
import { SpaEnvProcessName, SpaEnvService } from '../../../../services/spa-env.service';

/**
 * Wrapper around common-consent-modal that contains verbage for 'Information Collection Notice"
 * modal.
 */

@Component({
  standalone: false,
  selector: 'msp-consent-modal',
  templateUrl: './consent-modal.component.html',
})
export class MspConsentModalComponent implements OnInit {
  constructor(private spaEnvService: SpaEnvService) {}

  @Input() consentProcessName: SpaEnvProcessName = 'MSP';
  @ViewChild('mspConsentModal', { static: true }) public mspConsentModal: ConsentModalComponent;

  @Output() accept: EventEmitter<any> = new EventEmitter<any>();

  links = environment.links;
  isUnderMaintenance = false;
  maintenanceMessage = '';

  ngOnInit() {
    this.spaEnvService.checkMaintenance(this.consentProcessName).subscribe(check => {
      this.isUnderMaintenance = check.isUnderMaintenance;
      this.maintenanceMessage = check.message;
    });
  }

  onAccept($event) {
    this.accept.emit($event);
  }

  showFullSizeView() {
    this.mspConsentModal.showFullSizeView();
  }
}
