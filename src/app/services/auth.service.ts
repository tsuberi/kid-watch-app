import {Injectable}      from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import {Bl} from '../bl/bl';

declare var Auth0Lock: any;

@Injectable()
export class Auth {
  // Configure Auth0

  lock = new Auth0Lock('qfyV6JXR4yzsho9OUf2kF5TWcCNom8Wb', 'kid-watch.eu.auth0.com', {});

  userProfile: Object;


  constructor(private _BL: Bl) {
  }

  public login() {

    // Call the show method to display the widget.
    this.lock.show((err: string, profile: string, id_token: string) => {
      if (err) {
        throw new Error(err);
      }

      this._BL.Login(profile,id_token);

    });

    this.authenticated();
  };

  public authenticated() {
    return tokenNotExpired();
  };

  public logout() {

    this._BL.Logout();


    this.authenticated();
  };


  public googleLogin() {

    this.lock.login({
        connection: 'google-oauth2'
      },
      function (err) {
        if (err) {
          alert('something went wrong: ' + err.message);
        }
      });
  };

}

