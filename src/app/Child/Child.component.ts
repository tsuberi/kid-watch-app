import {Component, OnInit, Input, Directive, HostListener, ViewChild} from '@angular/core';
import {Child, Responsible, Kindergarten, SmsQ} from "../bl/models";
import {Bl} from "../bl/bl";
import {Http} from '@angular/http';

declare let jQuery;


@Component({
  selector: '[child]',
  templateUrl: './Child.component-new.html',
  styleUrls: ['./Child.component.css']
})
export class ChildComponent implements OnInit {

  @Input() _Child:Child;
  @Input('_Kindergarten') _Kindergarten: Kindergarten;

  _Url:string = '';
  @ViewChild('ChildItem') _ChildItem;
  _Password: string;
  _Responsible : Responsible [] = [];
  _InOutToggle  : boolean = false;
  _Arrived : boolean = false;
  _Laft : boolean = false;
  _WrongPassword : string = '';




  parseDate(inDate)
  {

  /*  if (( inDate == "Done" ) || ( inDate == "" ))
      inDate = Date.now()*/
    return Date.parse(inDate) || 0;
  }


  GetPassword() {

    let url = 'client' + '?email=' + this._Child.parent_id;
    url =  this._BL._BaseUrl + url;

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


    let now = new Date();
    //let inTime = new Date(now.getFullYear(), now.getMonth() , now.getDate(), this._Kindergarten.closing_hour , this._Kindergarten.closing_minutes, now.getSeconds() );
    let inTime = new Date(now.getFullYear(), now.getMonth() , now.getDate(), 8 , 0, now.getSeconds() );


    console.log(now)
    console.log(inTime)


    if ( now  < inTime ){
      this._InOutToggle = false;
    }
    else{
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

    var $toggle  = jQuery('.ui.toggle.button');
    $toggle
      .state({

      })
    ;

    if (this._Child)
      this._Url = this._BL._UploadUrl + "view_photo/" + this._Child.picture;


  }

  ngOnDestroy() {

  }


  constructor(private _BL: Bl,private http: Http) {

    if ( this._Child )
      this._Url  = _BL._UploadUrl + "view_photo/" + this._Child.picture;

  }

  isArrived(){
    return !!this._Child.in_date
  }

  isExited(){
    return !!this._Child.out_date
  }

  onClick(){
    let _PasswordOK = false;

    this._WrongPassword ='';




    for (let r of this._Responsible) {
      if ( r.phone == this._Password)
      {
        debugger;

        for ( let qq of this._Responsible ){

          let _SmsQ :  SmsQ =  new SmsQ();
          _SmsQ.kid_name = this._Child.name;
          _SmsQ.parent_id = this._Child.parent_id;
          _SmsQ.send_date = new Date().toISOString().replace('Z', '0').replace('+', '.');;
          _SmsQ.send_date_request = new Date().toISOString().replace('Z', '0').replace('+', '.');;
          _SmsQ.sms_type = "_Arrived";
          _SmsQ.responsible_name = qq.name;
          _SmsQ.responsible_relation = qq.relation;
          _SmsQ.responsible_phone = qq.phone;

          this._BL.SaveSmsQ(_SmsQ).subscribe();
        }

        if (! this._InOutToggle ){
          this._Child.out_date = new Date().toISOString().replace('Z', '0').replace('+', '.');
          this._Arrived = true;

        }
        else {
          this._Child.in_date = new Date().toISOString().replace('Z', '0').replace('+', '.');
          this._Laft = true;

          for ( let qq of this._Responsible ){

            let _SmsQ :  SmsQ =  new SmsQ();
            _SmsQ.kid_name = this._Child.name;
            _SmsQ.parent_id = this._Child.parent_id;
            _SmsQ.send_date = new Date().toISOString().replace('Z', '0').replace('+', '.');;
            _SmsQ.send_date_request = new Date().toISOString().replace('Z', '0').replace('+', '.');;
            _SmsQ.sms_type = "_Left"
            _SmsQ.responsible_name = qq.name;
            _SmsQ.responsible_relation = qq.relation;
            _SmsQ.responsible_phone = qq.phone;

            this._BL.SaveSmsQ(_SmsQ).subscribe();
          }



        }
        this._Password = '';
        this._BL.SaveKindergarten().subscribe();
        _PasswordOK = true;

        this._InOutToggle = !this._InOutToggle;


      }
    }

    if ( ! _PasswordOK)
      this._WrongPassword ='סיסמא שגויה';


    if ( _PasswordOK ){
      _PasswordOK = true;
    }

  }
}
