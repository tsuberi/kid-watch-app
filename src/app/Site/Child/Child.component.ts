import {Component, OnInit, Input} from '@angular/core';
import {Bl} from '../../bl/bl';
import {Child} from '../../bl/models';

declare let jQuery;

@Component({
  selector: 'my-child',
  templateUrl: './Child.component.html',
  styleUrls: ['./Child.component.css']
})
export class ChildComponent implements OnInit  {

  @Input() _Child: Child;
  _Url : string = '';


  delete() {
    let index = this._BL._Client.child_list.indexOf(this._Child);

    if (index !== -1) {
      
      this._BL._Client.child_list.splice(index, 1);
     
      this._BL.SaveClient().subscribe();
    }
  }


  ngOnInit() {
   
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

    // .transition('bounce', '2000ms')

  }

  ngOnDestroy() {

  }

  constructor(private _BL: Bl) {

    this._Url  = _BL._UploadUrl;

  }

  getDate(){
    return new Date(this._Child.birth_day)
  }
}
