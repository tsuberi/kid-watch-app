import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Kindergarten, AuthData , Client} from './models';
import {Router} from "@angular/router";

declare var jQuery;


@Injectable()
export class Bl {



  _BaseUrl = 'https://ckid-ckid.appspot.com/_ah/api/watch_kid_server/v1/'

  //_BaseUrl = 'http://localhost:9090/_ah/api/watch_kid_server/v1/'

  //_UploadUrl = 'https://ckid-ckid.appspot.com/api/'
  _UploadUrl = 'http://watch-kid.com/api/'



  _Kindergarten = new Kindergarten();
  _Client = new Client();


  constructor(public http: Http,private router : Router) {
    let LocalKindergarten = Object.assign(new Kindergarten(), JSON.parse( localStorage.getItem('Kindergarten')));
    if ( LocalKindergarten ){
      this._Kindergarten = LocalKindergarten;
    }

    let LocalClient = Object.assign(new Client(), JSON.parse( localStorage.getItem('Client')));
    if ( LocalClient ){
      this._Client = LocalClient;
    }
  }


  LoadLocalData(){
    let LocalKindergarten = JSON.parse( localStorage.getItem('Kindergarten'));
    if ( LocalKindergarten ){
      this._Kindergarten = LocalKindergarten;
    }
  }
  GetAllKindergarten (): Observable<Kindergarten[]> {
    let url = 'kindergarten?order=name';

    url =  this._BaseUrl + url;

    return this.http.get(url)
      .map(this.GetAllKindergartenExtractData)
      .catch(this.GetAllKindergartenHandleError);
  }

  GetClient() {


    let url = 'client' + '?email=' + this._Client.auth.email;

    url =  this._BaseUrl + url;


    this.http.get(url)
      .map(res => res.text())
      .subscribe(
        data => {

          let client = JSON.parse(data);

          if (client['items'] !== undefined) {
            this._Client = client['items'][0];
            localStorage.setItem('client', JSON.stringify(this._Client));

          }
          this.router.navigateByUrl('/site/RegisterChild');

        },
        err => console.log, //this.logError(err),
        () => console.log('Random Quote Complete')
      );
  }

  GetKindergarten() {
    let url = 'kindergarten' + '?kindergarten_id=' + this._Kindergarten.auth.email;

    url =  this._BaseUrl + url;


    this.http.get(url)
      .map(res => res.text())
      .subscribe(
        data => {

          let Kindergarten = JSON.parse(data);

          if (Kindergarten['items'] !== undefined) {
            this._Kindergarten = Kindergarten['items'][0];
            localStorage.setItem('Kindergarten', JSON.stringify(this._Kindergarten));
            this.router.navigateByUrl('/site/RegisterKindergarten');
          }
          else{
            this.GetClient();
          }
        },
        err => console.log, //this.logError(err),
        () => console.log('Random Quote Complete')
      );
  }



  SaveKindergarten(): Observable<Kindergarten> {
    let body = JSON.stringify(this._Kindergarten);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = 'kindergarten'

    url =  this._BaseUrl + url;

    console.log(body);
    localStorage.setItem('Kindergarten',body);

    return this.http.post(url, body, options)
      .map(this.SaveKindergartenExtractData)
      .catch(this.SaveKindergartenHandleError);

  }


  SaveKindergartenHandleError(err: any) {
    return Observable.throw(err);
  }

  SaveKindergartenExtractData(data): Kindergarten[] {
    console.log(data);
    return data;
  }


  SaveClient(): Observable<Client> {
    //this._Client.auth = this._Kindergarten.auth;
    let body = JSON.stringify(this._Client);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = 'client';

    url =  this._BaseUrl + url;

    console.log(body);
    localStorage.setItem('Client',body);

    return this.http.post(url, body, options)
      .map(this.SaveClientExtractData)
      .catch(this.SaveClientHandleError);

  }


  SaveClientHandleError(err: any) {
    return Observable.throw(err);
  }

  SaveClientExtractData(data): Client {
    return data;
  }



  GetAllKindergartenHandleError(err: any) {
    return Observable.throw(err);
  }

  GetAllKindergartenExtractData(data): Kindergarten[] {

    let items =  JSON.parse(data._body)['items'] ;
    console.log(items);
    return items;
  }

  Logout()
  {

    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('Kindergarten');
    localStorage.removeItem('Client');

    this._Client = new Client();
    this._Kindergarten = new Kindergarten();
    this.router.navigateByUrl('/');


  }

  Login(profile,id_token)
  {
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('id_token', id_token);
    let p = JSON.parse(JSON.stringify(profile));

    let auth = new AuthData();

    auth.email = p.email;
    auth.name = p.name;

    auth.clientID = p.clientID;
    auth.picture = p.picture;
    auth.user_id = p.user_id;
    auth.nickname = p.nickname;
    auth.global_client_id = p.global_client_id;
    auth.provider = p["identities"].provider;
    auth.token = id_token;

    if ( p.given_name){
      auth.given_name = p.given_name;
    }

    if ( p.family_name){
      auth.family_name = p.family_name;
    }

    this._Kindergarten.auth =  auth ;
    this._Client.auth =  auth ;


    this.GetKindergarten();

  }
}
