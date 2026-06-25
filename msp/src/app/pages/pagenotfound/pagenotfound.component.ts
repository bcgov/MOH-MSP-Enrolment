import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MspDataService } from 'app/services/msp-data.service';
@Component({
  templateUrl: './pagenotfound.component.html'
})
export class PageNotFoundComponent {
  constructor(
    private mspDataService: MspDataService,
    private router: Router
  ) {}
}
