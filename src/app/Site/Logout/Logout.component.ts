import {Component, OnInit} from '@angular/core';
import {Auth} from "../../services/auth.service";
import {Bl} from "../../bl/bl";
import {Kindergarten} from "../../bl/models";

@Component({
  selector: 'my-logout',
  templateUrl: './Logout.component.html',
  styleUrls: ['./Logout.component.css']
})
export class LogoutComponent implements OnInit {

  ngOnInit() {
    
  }

  ngOnDestroy() {

  }

  constructor(private _bl: Bl, public auth: Auth) {

    this._bl._Kindergarten = new Kindergarten();

    if (!this.auth.authenticated()) {
      this.auth.login();
    }
  }

}
