import {Component, OnInit, Input, Directive, HostListener, ViewChild} from '@angular/core';
import {Child, Responsible, Kindergarten, SmsQ} from "../bl/models";
import {Bl} from "../bl/bl";
import {Http} from '@angular/http';
import {debug} from "util";

declare let jQuery;


@Component({
  selector: '[child]',
  templateUrl: './Child.component-new.html',
  styleUrls: ['./Child.component.css']
})
export class ChildComponent implements OnInit {

  @Input() _Child:Child;
  @Input('_Kindergarten') _Kindergarten:Kindergarten;

  _Url:string = '';
  @ViewChild('ChildItem') _ChildItem;
  _Password:string;
  _Responsible:Responsible [] = [];
  _InOutToggle:boolean = false;
  _Arrived:boolean = false;
  _Left:boolean = false;
  _WrongPassword:string = '';


  parseDate(inDate) {

    return inDate.substring(11, 16);
  }


  GetPassword() {

    let url = 'client' + '?email=' + this._Child.parent_id;
    url = this._BL._BaseUrl + url;

    this.http.get(url)
      .map(res => res.text())
      .subscribe(
        data => {

          let client = JSON.parse(data);

          if (client['items'] !== undefined) {
            this._Responsible = client.items[0].responsible_list;
          }
        },
        err => console.log, //this.logError(err),
        () => console.log('Random Quote Complete')
      );
  }


  ngOnInit() {

    let c = this.GetDate();


    if ((this._Child.in_date) && ( c.substring(0, 10) == this._Child.in_date.substring(0, 10) )) {
      this._Arrived = true;
      this._BL._Kindergarten.max_arrived++;
    }

    if (c.substring(0, 10) == this._Child.out_date.substring(0, 10)) {
      this._Left = true;
      this._BL._Kindergarten.max_left++;
    }


    let now = new Date();
    let inTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, now.getSeconds());

    if (now < inTime) {
      this._InOutToggle = false;
    }
    else {
      this._InOutToggle = true;
    }

    jQuery('.ChildComponent')

      .show('slow')
      .transition({
        animation: 'scale',
        duration: 100,
        interval: 100
      })

      .transition({
        animation: 'scale',
        duration: 1000,
        interval: 100
      });

    this.GetPassword();

    var $toggle = jQuery('.ui.toggle.button');
    $toggle
      .state({})
    ;

    if (this._Child)
      this._Url = this._BL._UploadUrl + "view_photo/" + this._Child.picture;


  }

  ngOnDestroy() {
  }


  constructor(private _BL:Bl, private http:Http) {

    if (this._Child)
      this._Url = _BL._UploadUrl + "view_photo/" + this._Child.picture;

  }

  isArrived() {
    return !!this._Child.in_date
  }

  isExited() {
    return !!this._Child.out_date
  }

  getBirthday()  {
    return new  Date(this._Child.birth_day);
  }

  GetDate(){

    var d = new Date();

    let year = d.getFullYear();
    let month = (d.getMonth() +1).toString();
    let day = d.getDate().toString();
    let hour = d.getHours().toString();
    let minute = d.getMinutes().toString();
    let seconds = d.getSeconds().toString();

    if ( d.getMonth() < 10)
      month = "0" + month;
    if ( d.getDate() < 10)
      day = "0" + day;
    if ( d.getHours() < 10)
      hour = "0" + hour;
    if ( d.getMinutes() < 10)
      minute = "0" + minute;
    if ( d.getSeconds() < 10)
      seconds = "0" + seconds;

    return year + "-" + month + "-" + day +"T" + hour +":" + minute + ":" + seconds + ".0000"

  }


  onClick(){


    let _PasswordOK = false;

    this._WrongPassword ='';

    for (let r of this._Responsible) {
      if ( r.phone == this._Password)
      {
        _PasswordOK = true;
        break;
      }
    }


    let _SmsQ :  SmsQ =  new SmsQ();

    if (  this._Arrived == false){
      for (let r of this._Responsible){
        _SmsQ.kid_name = this._Child.name;
        _SmsQ.parent_id = this._Child.parent_id;
        _SmsQ.send_date =  this.GetDate();
        _SmsQ.send_date_request = this.GetDate();
        _SmsQ.sms_type = "_Arrived";
        _SmsQ.responsible_name = r.name;
        _SmsQ.responsible_relation = r.relation;
        _SmsQ.responsible_phone = r.phone;
        this._Child.in_date = this.GetDate();
        this._BL.SaveSmsQ(_SmsQ).subscribe();


      }

      this._Arrived = true;
      this._BL._Kindergarten.max_arrived ++;
      this._InOutToggle = !this._InOutToggle;
      this._BL.SaveKindergarten().subscribe();

    }
    else {

      for (let r of this._Responsible){
        _SmsQ.kid_name = this._Child.name;
        _SmsQ.parent_id = this._Child.parent_id;
        _SmsQ.send_date =  this.GetDate();
        _SmsQ.send_date_request = this.GetDate();
        _SmsQ.sms_type = "_Left";
        _SmsQ.responsible_name = r.name;
        _SmsQ.responsible_relation = r.relation;
        _SmsQ.responsible_phone = r.phone;
        this._Child.out_date = this.GetDate();
        this._BL.SaveSmsQ(_SmsQ).subscribe();
      }

      if (this._Left == false ){
        this._Left = true;
        this._BL._Kindergarten.max_left ++;
        this._InOutToggle = !this._InOutToggle;
        this._BL.SaveKindergarten().subscribe();
      }

      }


    if ( ! _PasswordOK)
      this._WrongPassword ='סיסמא שגויה';

  }
}
