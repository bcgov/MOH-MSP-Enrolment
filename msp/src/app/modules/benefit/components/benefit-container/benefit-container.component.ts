import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { displayedbenefitPages } from '../../benefit-page-routing.modules';
import { Container } from 'moh-common-lib-angular';
import { HeaderService } from '../../../../services/header.service';

@Component({
  standalone: false,
  selector: 'msp-benefit-container',
  templateUrl: './benefit-container.component.html',
  styleUrls: ['./benefit-container.component.scss']
})
export class BenefitContainerComponent extends Container {

  constructor( public router: Router, private header: HeaderService ) {
    super();
    this.setProgressSteps( displayedbenefitPages );
    this.header.setTitle('Supplementary Benefits');
  }
}
