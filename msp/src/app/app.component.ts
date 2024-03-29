import { Component, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import * as version from '../version.GENERATED';
import { HeaderService } from './services/header.service';
import { SpaEnvService } from './services/spa-env.service';
// import { } from '../version.GENERATED';

@Component({
  selector: 'general-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class GeneralAppComponent {
  private viewContainerRef: ViewContainerRef;
  routerSubscription: Subscription;
  headerSubscription: Subscription;
  titleSubscription: Subscription;
  // Even though we update this from headerService, we still want to set default value to avoid pop-in.
  public headerName: string = environment.appConstants.serviceName;

  public constructor(
    viewContainerRef: ViewContainerRef,
    private router: Router,
    private header: HeaderService,
    private spaEnvService: SpaEnvService,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
  ) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;

    // Specific handling for refresh / first navigation
    this.handleRefresh(location.pathname);
  }

  handleRefresh(url) {
    // Refresh on account change
    if (url.includes('/deam')) {
      // if on the home page, don't redirect but remove any stored application data
      if (url.includes('/home')) {
        this.clearStorage();
        // if anywhere else besides confirmation, redirect them to the home page
      } else if (!url.includes('/confirmation')) {
        this.hardRedirect('/msp/deam/home');
      }
      // Refresh on retro assistance
    } else if (url.includes('/assistance')) {
      // if on the home page, don't redirect but remove any stored application data
      if (url.includes('/home')) {
        this.clearStorage();
        // if anywhere else besides confirmation, redirect them to the home page
      } else if (!url.includes('/confirmation')) {
        this.hardRedirect('/msp/assistance/home');
      }
      // SuppBen and MSP Enrolment have been moved to JHA (AHDC)
    } else if (url.includes('/benefit') || url.includes('/enrolment')) {
      location.assign('https://my.gov.bc.ca/ahdc');
    }
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        document.body.scrollTop = 0;
      });

    const prefix = environment.appConstants.serviceName;
    this.headerSubscription = this.header.title.subscribe((title) => {
      this.headerName = title;
    });

    version.success
      ? console.log('%c' + version.message, 'color: #036; font-size: 20px;')
      : console.error(version.message);
    this.spaEnvService
      .loadEnvs()
      .subscribe((response) => this.spaEnvService._values.next(response));

    this.titleSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const rt = this.getChild(this.activatedRoute);
        rt.data.subscribe((data) => {
          this.titleService.setTitle(data.title);
        });
      });
  }

  ngOnDestroy() {
    // note - if we add any more subscriptions, refactor to a takeUntil()
    this.routerSubscription.unsubscribe();
    this.headerSubscription.unsubscribe();
    this.titleSubscription.unsubscribe();
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  clearStorage() {
    window.sessionStorage.clear();
  }

  hardRedirect(path) {
    location.assign(path);
  }
}
