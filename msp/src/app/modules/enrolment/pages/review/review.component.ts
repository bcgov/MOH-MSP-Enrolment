import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolForm } from '../../models/enrol-form';
import { EnrolDataService } from '../../services/enrol-data.service';
import { Address } from 'moh-common-lib';

@Component({
  templateUrl: './review.component.html'
})
export class ReviewComponent extends EnrolForm {

  // routes
  personal_info = ROUTES_ENROL.PERSONAL_INFO.fullpath;
  spouse_info = ROUTES_ENROL.SPOUSE_INFO.fullpath;
  address_info = ROUTES_ENROL.CONTACT.fullpath;
  child_info = ROUTES_ENROL.CHILD_INFO.fullpath;

  mailingAddress: Address;

  constructor( protected enrolDataService: EnrolDataService,
               protected pageStateService: PageStateService,
               protected router: Router ) {
    super( enrolDataService, pageStateService, router );
  }

  ngOnInit(){
    // Only display mailing if it is different.
    this.mailingAddress = null;
    if (! this.mspApplication.mailingSameAsResidentialAddress) {
      this.mailingAddress = this.mspApplication.mailingAddress;
    }
  }

  get hasSpouse() {
    return this.mspApplication.spouse ? true : false;
  }

  get hasChildren() {
    return this.mspApplication.children && this.mspApplication.children.length > 0;
  }

  continue() {
    this._canContinue = true;
    this._nextUrl = ROUTES_ENROL.AUTHORIZE.fullpath;
    super.continue();
  }
}
