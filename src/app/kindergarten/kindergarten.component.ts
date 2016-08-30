import {Component, OnInit} from '@angular/core';
import {  Bl } from '../bl'
import { ClockComponent } from '../clock';
import {Http} from '@angular/http';
import {ChildComponent} from "../Child/Child.component";
import {Child} from "../bl/models";

declare var jQuery;



@Component({
  selector: 'kindergarten',
  directives: [ClockComponent,ChildComponent], // [ClockComponent],
  templateUrl: './kindergarten.component-new.html',
  styleUrls: ['./kindergarten.component.css']
})
export class KindergartenComponent implements OnInit {

  _Url : string = '';
  mockChilds = [new Child(),new Child(),new Child(),new Child(),new Child()];


  constructor(private _BL: Bl,public http: Http) {

    this._Url  = _BL._UploadUrl;

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
