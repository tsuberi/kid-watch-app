import {provideRouter, RouterConfig} from '@angular/router';
import {HomeComponent} from './home';
import {AboutItemComponent} from './AboutItemComponent';
import {KindergartenComponent} from './kindergarten';
import {SiteComponent} from './site';
import {HomeSiteComponent} from './site/HomeSite';
import {HomeRegisterComponent} from './site/HomeRegister';
import {LoginComponent} from './site/Login';
import {LogoutComponent} from './site/Logout';
import {RegisterKindergartenComponent} from './site/RegisterKindergarten';
import {RegisterChildComponent} from './site/RegisterChild';

export const routes: RouterConfig = [
  {path: '', component: HomeComponent},
  {path: 'kindergarten', component: KindergartenComponent},
  {path: 'RegisterChild', component: RegisterChildComponent},
  {path: 'RegisterKindergarten', component: RegisterKindergartenComponent},

  {path: 'home', component: HomeComponent},
  {
    path: 'site',
    component: SiteComponent,
    children: [
      {path: '', component: HomeSiteComponent},
      {path: 'RegisterKindergarten', component: RegisterKindergartenComponent},
      {path: 'RegisterChild', component: RegisterChildComponent},
      {path: 'register', component: HomeRegisterComponent},
      {path: 'login', component: LoginComponent},
      {path: 'logout', component: LogoutComponent},
      {path: 'kindergarten', component: KindergartenComponent},
      {path: 'item/:id', component: AboutItemComponent}
    ]
  }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
