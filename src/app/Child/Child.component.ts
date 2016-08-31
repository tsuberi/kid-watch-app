import {Component, OnInit, Input, Directive, HostListener, ViewChild} from '@angular/core';
import {Child, Responsible} from "../bl/models";
import {Bl} from "../bl/bl";
import {Http, Headers, RequestOptions} from '@angular/http';

declare let jQuery;


@Component({
  selector: '[child]',
  templateUrl: './Child.component-new.html',
  styleUrls: ['./Child.component.css']
})
export class ChildComponent implements OnInit {

  @Input() _Child:Child;
  _Url:string = '';
  @ViewChild('ChildItem') _ChildItem;
  _Arrived : boolean = true;

  _Password: string;
  _Responsible : Responsible [] = [];



  parseDate(inDate)
  {
    return new Date(inDate)

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
    console.log('Hello ChildComponent');

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
    // .transition('bounce', '2000ms')

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

    for (let r of this._Responsible) {

      if ( r.phone == this._Password)
      {
        if(this.isArrived())
          this._Child.out_date = new Date().toISOString().replace('Z', '0').replace('+', '.');
        else
          this._Child.in_date = new Date().toISOString().replace('Z', '0').replace('+', '.');

        this._Password = '';
        this._BL.SaveKindergarten().subscribe();
      }
    }


  }
}
