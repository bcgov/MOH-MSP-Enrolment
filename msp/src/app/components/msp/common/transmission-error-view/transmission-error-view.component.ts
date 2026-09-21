import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'msp-transmission-error-view',
  templateUrl: './transmission-error-view.component.html',
  styleUrls: ['./transmission-error-view.scss'],
})
export class TransmissionErrorViewComponent {
  @Input()
  rawError: any;
  public showMoreErrorDetails: boolean;

  toggleErrorDetails() {
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }
}
