import {
  Component,
  Input,
  ViewChild,
  NgZone,
} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from '../../../../../environments/environment';
import { CommonImage, CommonImageError } from 'moh-common-lib-angular';
import devOnlyConsoleLog from 'app/_developmentHelpers/dev-only-console-log';
import enLang from './i18n/data/en/index';

@Component({
  standalone: false,
  selector: 'common-image-error-modal',
  templateUrl: './image-error-modal.component.html'
})
export class MspImageErrorModalComponent {
  lang = enLang;
  @Input() imageWithError: CommonImage;
  @ViewChild('errorModal', { static: true }) public errorModal: ModalDirective;

  constructor(private zone: NgZone) {}

  /**
   * Returns an error message
   * @returns {string}
   */
  getErrorMessage(): string {
    let message: string = this.lang.imageError[this.imageWithError.error];
    if (this.imageWithError.error === CommonImageError.TooSmall) {
      message = message.replace('{width}', environment.appConstants.images.minWidth.toString());
      message = message.replace('{height}', environment.appConstants.images.minHeight.toString());
    }
    return message;
  }

  /**
   * A special method to force the rendering of this component.  This is a workaround
   * because for some unknown reason, AngularJS2 change detector does not detect the
   * change of the imageWithError.
   */
  forceRender() {
    this.zone.run(() => {
      devOnlyConsoleLog('force render');
    });
  }

  showFullSizeView(){
    this.errorModal.config.backdrop = false;
    this.errorModal.show();
  }

  continue() {
    this.imageWithError = null;
    this.errorModal.hide();
  }

}
