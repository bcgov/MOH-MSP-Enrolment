import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiStatusCodes } from 'moh-common-lib-angular';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { format } from 'date-fns';
import devOnlyConsoleLog from 'app/_developmentHelpers/dev-only-console-log';

@Component({
  standalone: false,
  selector: 'msp-acl-confirmation',
  templateUrl: './acl-confirmation.component.html',
  styleUrls: ['./acl-confirmation.component.scss'],
})
export class AclConfirmationComponent implements OnInit, OnDestroy {
  confirmationNum: string;
  status: ApiStatusCodes = ApiStatusCodes.ERROR;
  message: string;

  links = environment.links;

  private _subscription: Subscription;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this._subscription = this.route.queryParams.subscribe((params) => {
      devOnlyConsoleLog('PARAMS[status]:', params['status']);
      if (params['status']) {
        this.status = params['status'];
      }

      devOnlyConsoleLog('PARAMS[confirmationNum]:', params['confirmationNum']);
      if (params['confirmationNum']) {
        this.confirmationNum = params['confirmationNum'];
      }

      devOnlyConsoleLog('PARAMS[message]:', params['message']);
      if (params['message']) {
        this.message = params['message'];
        this.message = this.message.replace(
          'HIBC',
          '<a href="' +
            this.links.HIBC +
            '" target="blank">Health Insurance BC</a>'
        );
        this.message = this.message.replace(
          'ACBC',
          '<a href="' +
            this.links.ACBC +
            '" target="blank">Change of Address Service</a>'
        );
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  get isSucess() {
    return this.status === ApiStatusCodes.SUCCESS;
  }

  /**
   * Today's date
   * @returns {string}
   */
  get dateStamp(): string {
    return format(new Date(), 'MMMM dd, yyyy');
  }
}
