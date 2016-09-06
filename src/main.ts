import {enableProdMode, provide} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {Bl} from './app/bl';
import {AppComponent} from './app/app.component';
import {APP_ROUTER_PROVIDERS} from './app/app.routes';
import {Auth} from "./app/services/auth.service";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

if (process.env.ENV === 'build') {
  enableProdMode();
}

bootstrap(AppComponent, [

  HTTP_PROVIDERS,
  APP_ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),,
  Auth,
  Bl
])
  .catch(err => console.error(err));
