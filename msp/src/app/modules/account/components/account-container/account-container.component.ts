import {
  Component,
} from '@angular/core';
import { Container, PageStateService } from 'moh-common-lib-angular';
import { Router } from '@angular/router';
import { accountPageRoutes } from '../../account-pages.route';
import { HeaderService } from '../../../../services/header.service';
import { ACCOUNT_PAGES } from '../../account.constants';

@Component({
  standalone: false,
  selector: 'msp-account-container',
  templateUrl: './account-container.component.html',
  styleUrls: ['./account-container.component.scss']
})
export class AccountContainerComponent extends Container {

  constructor(public router: Router,
              private header: HeaderService,
              private pageStateService: PageStateService) {
    super();
    this.setProgressSteps(  accountPageRoutes );
    this.header.setTitle('Account Management');
    this.pageStateService.setPages(accountPageRoutes, ACCOUNT_PAGES);
  }
}
