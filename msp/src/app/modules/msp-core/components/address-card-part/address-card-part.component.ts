import {Component, Input} from '@angular/core';
import { Address, getCountryDescription, getProvinceDescription } from 'moh-common-lib-angular';

// TODO: replace with msp-address-review-part uses the msp-review-part
@Component({
  standalone: false,
  selector: 'msp-address-card-part',
  templateUrl: './address-card-part.component.html'
})
export class MspAddressCardPartComponent {
  @Input() address: Address;
  @Input() label: string;

  get country() {
    return getCountryDescription( this.address.country );
  }

  get province() {
    return getProvinceDescription( this.address.province );
  }

}
