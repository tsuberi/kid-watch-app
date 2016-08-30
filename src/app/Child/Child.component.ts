import {Component, OnInit, Input, Directive, HostListener, ViewChild} from '@angular/core';
import {Child} from "../bl/models";
import {Bl} from "../bl/bl";

declare let jQuery;


@Component({
  selector: 'my-child',
  templateUrl: './Child.component.html',
  styleUrls: ['./Child.component.css']
})
export class ChildComponent implements OnInit {

  @Input() _Child:Child;
  _Url:string = '';
  @ViewChild('ChildItem') _ChildItem;
  _Arrived : boolean = true;

  password: string;

  @HostListener('mouseenter') onMouseEnter() {


    jQuery('.eli').dimmer({
      on: 'hover'
    });
  }

  @HostListener('click') onclick() {

    jQuery(this._ChildItem.nativeElement)
      .modal('show');

  }

  @HostListener('mouseleave') onMouseLeave() {

    jQuery('.eli').dimmer({
      on: 'hover'
    });

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


  constructor(private _BL: Bl) {

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
    if(this.isArrived())
      this._Child.out_date = new Date().toISOString().replace('Z', '0').replace('+', '.');
    else
      this._Child.in_date = new Date().toISOString().replace('Z', '0').replace('+', '.');

    this._BL.SaveKindergarten().subscribe();
  }
}
