import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestAclRoutingModule } from './request-acl-routing.module';
import { RequestLetterComponent } from './pages/request-letter/request-letter.component';
import { AclConfirmationComponent } from './pages/acl-confirmation/acl-confirmation.component';
import {
  ConfirmTemplateComponent, DateComponent, FormActionBarComponent, PageFrameworkComponent,
  PageSectionComponent, PhnComponent, PostalCodeComponent, RadioComponent, DuplicateCheckDirective,
  ValidatePostalcodeDirective
} from 'moh-common-lib-angular';
import { CaptchaModule } from 'moh-common-lib-angular/captcha';
import { FormsModule } from '@angular/forms';
import { MspCoreModule } from '../msp-core/msp-core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MspCoreModule,
    RequestAclRoutingModule,
    CaptchaModule,
    ConfirmTemplateComponent,
    DateComponent,
    FormActionBarComponent,
    PageFrameworkComponent,
    PageSectionComponent,
    PhnComponent,
    PostalCodeComponent,
    RadioComponent,
    DuplicateCheckDirective,
    ValidatePostalcodeDirective
  ],
  declarations: [
    RequestLetterComponent,
    AclConfirmationComponent
  ]
})
export class RequestAclModule { }
