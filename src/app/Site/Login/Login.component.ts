import { Component, OnInit } from '@angular/core';
import {Auth} from "../../services/auth.service";
import {Bl} from "../../bl/bl";
import {Router} from "@angular/router";

@Component({
  selector: 'my-login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class LoginComponent implements OnInit {

  ngOnInit() {
    
  }

  ngOnDestroy() {

  }

	constructor(private _bl: Bl, public auth: Auth, private router : Router) {
    if (!this.auth.authenticated()) {
      this.auth.login();
    }
    else
    {
      //router.navigateByUrl('/site/RegisterChild') ;
    }

  }

}
