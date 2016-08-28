import {Component, OnInit, Directive} from '@angular/core';
import {  Bl } from '../bl'
import { ClockComponent } from '../clock';
import {Http} from '@angular/http';
import {ChildComponent} from "../Child/Child.component";

declare var jQuery;



@Component({
  selector: 'kindergarten',
  directives: [ClockComponent,ChildComponent], // [ClockComponent],
  templateUrl: './kindergarten.component.html',
  styleUrls: ['./kindergarten.component.css']
})
export class KindergartenComponent implements OnInit {

  _Url : string = '';
  _Image : string = '';




  constructor(private _BL: Bl,public http: Http) {
    if ( _BL._DebugMode){
      this._Url  = _BL._UploadUrl;
    }
    jQuery('.special.cards .image').dimmer({
      on: 'hover'
    });
  }



  ngOnInit() {
    console.log('Hello kindergarten');

    jQuery('.special.cards .image').dimmer({
      on: 'hover'
    });
  }
}
