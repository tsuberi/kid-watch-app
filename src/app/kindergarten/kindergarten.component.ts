import {Component, OnInit} from '@angular/core';
import {  Bl } from '../bl'
import { ClockComponent } from '../clock';
import {Http} from '@angular/http';
import {ChildComponent} from "../Child/Child.component";

declare var jQuery;



@Component({
  selector: 'kindergarten',
  directives: [ClockComponent,ChildComponent], // [ClockComponent],
  templateUrl: './kindergarten.component-new.html',
  styleUrls: ['./kindergarten.component.css']
})
export class KindergartenComponent implements OnInit {

  _Url : string = '';
  _Name :  string = '';
  _InTime :  string = '';
  _OutTime :  string = '';
  _MaxChilds : number = 0;
  _MaxArrived : number = 0;


  Refresh()
  {
    this._BL.GetKindergarten();
  }

  constructor(private _BL: Bl,public http: Http) {

    this._Url  = _BL._UploadUrl;
    this._Name = _BL._Kindergarten.name;
    //this._InTime  = _BL._Kindergarten.opening_hour  +":" +  _BL._Kindergarten.opening_minutes ;
    //this._OutTime  = _BL._Kindergarten.closing_hour  +":" +  _BL._Kindergarten.closing_minutes ;
    this._MaxChilds = _BL._Kindergarten.child_list.length;
    this._BL._Kindergarten.max_arrived = 0;
    this._BL._Kindergarten.max_left = 0;


    for (let c of _BL._Kindergarten.child_list){
      /*if ( c.in_date != ''){
        this._MaxArrived++;
      }*/
    }



    jQuery('.special.cards .image').dimmer({
      on: 'hover'
    });
  }



  ngOnInit() {

    jQuery('.special.cards .image').dimmer({
      on: 'hover'
    });
  }
}
