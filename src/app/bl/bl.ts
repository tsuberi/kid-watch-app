import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Kindergarten, AuthData , Client ,SmsQ} from './models';
import {Router} from "@angular/router";

declare var jQuery;


@Injectable()
export class Bl {



  //production
  _BaseUrl = 'https://ckid-ckid.appspot.com/_ah/api/watch_kid_server/v1/'
  _UploadUrl = 'http://watch-kid.com/api/'

  //local
  //_BaseUrl = 'http://localhost:9090/_ah/api/watch_kid_server/v1/'
  //_UploadUrl = 'https://ckid-ckid.appspot.com/api/'
  _Opening : string = '08:00'
  _Closing : string = '17:00'

    _Kindergarten_Openinig_Toggle : boolean = false;



  _Kindergarten = new Kindergarten();
  _Client = new Client();


  getClosingTime(){

    var d=new Date();
    var res = null;

    switch ( d.getDay() ){
      case 0:
        res = this._Kindergarten.schedule.sunday_closing_time;
        break;
      case 1:
        res = this._Kindergarten.schedule.monday_closing_time;
        break;
      case 2:
        res = this._Kindergarten.schedule.tuesday_closing_time;
        break;
      case 3:
        res = this._Kindergarten.schedule.wednesday_closing_time;
        break;
      case 4:
        res = this._Kindergarten.schedule.thursday_closing_time;
        break;
      case 5:
        res = this._Kindergarten.schedule.friday_closing_time;
        break;
      case 6:
        res = this._Kindergarten.schedule.saturday_closing_time;
        break;

    }

    this._Closing = res;
    return res;

  }


  getOpeningTime(){

    var d=new Date();
    var res = null;

    switch ( d.getDay() ){
      case 0:
        res = this._Kindergarten.schedule.sunday_opeing_time;
        break;
      case 1:
        res = this._Kindergarten.schedule.monday_opeing_time;
        break;
      case 2:
        res = this._Kindergarten.schedule.tuesday_opeing_time;
        break;
      case 3:
        res = this._Kindergarten.schedule.wednesday_opeing_time;
        break;
      case 4:
        res = this._Kindergarten.schedule.thursday_opeing_time;
        break;
      case 5:
        res = this._Kindergarten.schedule.friday_opeing_time;
        break;
      case 6:
        res = this._Kindergarten.schedule.saturday_opeing_time;
        break;

    }

    this._Opening = res;
    return res;

  }


  constructor(public http: Http,private router : Router) {
    let LocalKindergarten = Object.assign(new Kindergarten(), JSON.parse( localStorage.getItem('Kindergarten')));
    if ( LocalKindergarten ){
      this._Kindergarten = LocalKindergarten;
    }

    let LocalClient = Object.assign(new Client(), JSON.parse( localStorage.getItem('Client')));
    if ( LocalClient ){
      this._Client = LocalClient;
    }
    this.getClosingTime();
    this.getClosingTime();

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
            localStorage.setItem('Client', JSON.stringify(this._Client));

          }


        },
        err => console.log, //this.logError(err),
        () => console.log('Random Quote Complete')
      );
  }

  GetKindergarten() {
    debugger;
    let url = 'kindergarten' + '?kindergarten_id=' + this._Kindergarten.auth.email;

    url =  this._BaseUrl + url;


    this.http.get(url)
      .map(res => res.text())
      .subscribe(
        data => {

          let Kindergarten = JSON.parse(data);

          if (Kindergarten['items'] !== undefined) {
            this._Kindergarten = Kindergarten['items'][0];
            this._Kindergarten.max_arrived = 0;
            this._Kindergarten.max_left = 0;

            localStorage.setItem('Kindergarten', JSON.stringify(this._Kindergarten));

          }
          else{
            this.GetClient();
          }
        },
        err => console.log, //this.logError(err),
        () => console.log('Random Quote Complete')
      );
  }



  SaveSmsQ(SmsQ): Observable<SmsQ> {

    var yesterday = new Date(new Date().setDate(new Date().getDate()-1));

    let body = JSON.stringify(SmsQ);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = 'smsq'

    url =  this._BaseUrl + url;

    console.log(JSON.stringify(SmsQ));

    return this.http.post(url, body, options)
      .map(this.SaveSmsQExtractData)
      .catch(this.SaveSmsQHandleError);

  }


  SaveSmsQHandleError(err: any) {
    return Observable.throw(err);
  }

  SaveSmsQExtractData(data): Kindergarten[] {

    return data;
  }



  SaveKindergarten(): Observable<Kindergarten> {

    var yesterday = new Date(new Date().setDate(new Date().getDate()-1));

    let body = JSON.stringify(this._Kindergarten);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = 'kindergarten'

    url =  this._BaseUrl + url;


    console.log(JSON.stringify(this._Kindergarten));


    localStorage.setItem('Kindergarten',body);

    return this.http.post(url, body, options)
      .map(this.SaveKindergartenExtractData)
      .catch(this.SaveKindergartenHandleError);

  }




  SaveKindergartenHandleError(err: any) {
    return Observable.throw(err);
  }

  SaveKindergartenExtractData(data): Kindergarten[] {

   /* let Kindergarten = JSON.parse(data);

    if (Kindergarten['items'] !== undefined) {
      this._Kindergarten = Kindergarten['items'][0];
      localStorage.setItem('Kindergarten', JSON.stringify(this._Kindergarten));
*/

      return data;
  }


  SaveClient(): Observable<Client> {
    //this._Client.auth = this._Kindergarten.auth;
    let body = JSON.stringify(this._Client);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = 'client';

    url =  this._BaseUrl + url;
    console.log(JSON.stringify(this._Client));


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
    return items;
  }

  Logout()
  {

    localStorage.removeItem('id_token');
    localStorage.removeItem('Profile');
    localStorage.removeItem('Kindergarten');
    localStorage.removeItem('Client');

    this._Client = new Client();
    this._Kindergarten = new Kindergarten();
    this.router.navigateByUrl('/');


  }

  Login(profile,id_token)
  {
    localStorage.setItem('Profile', JSON.stringify(profile));
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
