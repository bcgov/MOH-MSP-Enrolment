import { Component, OnDestroy, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {ActivatedRoute} from '@angular/router';
import {BenefitApplication} from '../../models/benefit-application.model';
import { format } from 'date-fns';
import enLang from './i18n/data/en/index';

@Component({
  standalone: false,
  selector: 'msp-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class BenefitConfirmationComponent implements OnDestroy, OnInit {

    lang = enLang;
    confirmationNum: string;
    subscription: Subscription;
    noticeOfAssessment: string;
    isCutOff: boolean;
    isCutOffYear: boolean;

    constructor(private route: ActivatedRoute, public dataService: MspBenefitDataService) {

    }

    ngOnInit(): void {
        this.subscription = this.route.queryParams.subscribe(
            params => {
                this.confirmationNum = params['confirmationNum'];
                this.isCutOff = params['isCutOff'];
                this.isCutOffYear = params['isCutOffyear'];
            }
        );

        if (this.isCutOff) {
            if (this.isCutOffYear === true) {
                this.noticeOfAssessment =  this.lang.noticeOfAssessmentCutOffyear;

            } else {
                this.noticeOfAssessment = this.lang.noticeOfAssessmentNonCutOffyear;

            }
        } else if (this.isCutOff === false) {
            this.noticeOfAssessment = this.lang.noticeOfAssessment;
        }
    }

    get benefitApp(): BenefitApplication {
        return this.dataService.benefitApp;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Today's date
     * @returns {string}
     */
    get dateStamp(): string {
        return format(new Date(), 'MMMM dd, yyyy');
    }

    // Logic to get the cutoff Date text
   /* get noticeOfAssessment() {



    }*/
}
