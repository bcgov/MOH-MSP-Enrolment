import {ChangeDetectorRef, Component, QueryList, ViewChild, ViewChildren, AfterViewInit, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ProcessService} from '../../../../services/process.service';
import {NgForm} from '@angular/forms';
import {PersonalDetailsRetroSuppbenComponent} from '../../components/personal-details-retro-suppben/personal-details-retro-suppben.component';
import {BaseComponent} from '../../../../models/base.component';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import { CANADA } from 'moh-common-lib-angular';
import enLang from './i18n/data/en/index';

@Component({
  standalone: false,
   templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss']
})
export class BenefitPersonalInfoComponent extends BaseComponent implements AfterViewInit, OnInit {

    static ProcessStepNum = 1;

    lang = enLang;
    @ViewChild('formRef', { static: true }) personalInfoForm: NgForm;
    //@ViewChildren(BenefitPersonalDetailComponent) personalDetailsComponent: QueryList<BenefitPersonalDetailComponent>;
    @ViewChildren(PersonalDetailsRetroSuppbenComponent) personalDetailsComponent: QueryList<PersonalDetailsRetroSuppbenComponent>;
    //@ViewChild('address', { static: false }) address: MspAddressComponent;
    //@ViewChild('phone', { static: false }) phone: MspPhoneComponent;
    benefitApplication: BenefitApplication;

    constructor(private dataService: MspBenefitDataService,
                private _router: Router,
                private _processService: ProcessService,
                cd: ChangeDetectorRef) {
        super(cd);
        this.benefitApplication = this.dataService.benefitApp;
        this._processService.setStep(BenefitPersonalInfoComponent.ProcessStepNum, false);
        // if the country is blank or null or undefined then assign Canada By Default //DEF-153
        if (!this.benefitApplication.mailingAddress.country || this.benefitApplication.mailingAddress.country.trim().length === 0 ) {
            this.benefitApplication.mailingAddress.country = CANADA;
        }
    }

    ngAfterViewInit() {

        this.personalInfoForm.valueChanges.pipe(
            debounceTime(250),
            distinctUntilChanged()
        ).subscribe( () => {
            this.dataService.saveBenefitApplication();
        });
    }

    ngOnInit() {
        this.initProcessMembers(BenefitPersonalInfoComponent.ProcessStepNum, this._processService);
    }

    onChange() {
        this.dataService.saveBenefitApplication();
    }

    onSubmit() {
        this._processService.setStep(BenefitPersonalInfoComponent.ProcessStepNum, true);
        this._router.navigate(['/benefit/spouse-info']);
    }

    isValid(): boolean {
        return this.dataService.benefitApp.isUniquePhns && this.dataService.benefitApp.isUniqueSin;
    }

    get canContinue(): boolean {
        return (
            this.isAllValid() &&
            this.benefitApplication.applicant.assistYearDocs &&
            this.benefitApplication.applicant.assistYearDocs.length > 0
        );
    }

}
