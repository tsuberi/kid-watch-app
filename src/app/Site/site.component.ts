import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Auth} from '../services/auth.service';
import {Bl} from '../bl/bl';


declare var jQuery;

@Component({
  selector: 'my-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css'],
  directives: [ROUTER_DIRECTIVES]

})
export class SiteComponent implements OnInit {

  constructor(private _BL: Bl, private auth: Auth) {
  }

  login() {
    if (!this.auth.authenticated()) {
      this.auth.login();
    }
  }

  logout() {
    /*if (this.auth.authenticated()) {
      this.auth.logout();
    }*/
    this._BL.Logout();

  }

  loggedin() {
    return this.auth.authenticated();
  }

  ngOnInit() {
    if (!this.auth.authenticated()) {
      this.auth.login();
    }
  }
}
