import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LandingComponent } from './pages/landing/landing.component';
import { APP_ROUTES } from './models/route-constants';
import { PageNotFoundComponent } from './pages/pagenotfound/pagenotfound.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: { title: 'MSP Applications', breadcrumb: 'Home' }
  },
  {
    path: APP_ROUTES.PAGE_NOT_FOUND,
    component: PageNotFoundComponent,
  },
  // {
  //   path: APP_ROUTES.ENROLMENT,
  //   loadChildren: 'app/modules/enrolment/enrolment.module#EnrolmentModule'
  // },
  // {
  //   path: APP_ROUTES.BENEFIT,
  //   loadChildren: 'app/modules/benefit/benefit.module#BenefitModule'
  // // },
  {
    path: APP_ROUTES.ASSISTANCE,
    redirectTo: APP_ROUTES.PAGE_NOT_FOUND,
    pathMatch: 'full'
  },
  {
    path: APP_ROUTES.ACCOUNT,
    loadChildren: () =>
      import('./modules/account/account.module').then(m => m.AccountModule)
  },
  {
    path: APP_ROUTES.ACCOUNT_LETTER,
    loadChildren: () =>
      import('./modules/request-acl/request-acl.module').then(m => m.RequestAclModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
