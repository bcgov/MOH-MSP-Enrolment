import {Component, Input, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {MspDataService} from '../../../../services/msp-data.service';
import enLang from './i18n/data/en/index';


@Component({
  standalone: false,
  selector: 'msp-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss']
})
export class MspCancelComponent {
  lang = enLang;
  @Input() btnBlock = false;
  @ViewChild('fullSizeViewModal', { static: true }) public fullSizeViewModal: ModalDirective;
  @Input() accountButton = false;

  constructor(private dataService: MspDataService) {
  }

  showFullSizeView(){
    this.fullSizeViewModal.config.backdrop = false;
    this.fullSizeViewModal.show();
  }

  noButtonClick() {
    this.fullSizeViewModal.hide();
  }

  yesButtonClick() {
    this.dataService.destroyAll();

    // navigate to CMS
    window.location.href = this.lang.postCancelUrl;
  }
}
