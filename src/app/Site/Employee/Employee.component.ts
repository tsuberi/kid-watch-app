import {Component, OnInit, Input} from '@angular/core';
import {Bl} from '../../bl/bl';
import {Employee} from '../../bl/models';

declare var jQuery;

@Component({
  selector: 'my-employee',
  templateUrl: './Employee.component.html',
  styleUrls: ['./Employee.component.css']


})
export class EmployeeComponent implements OnInit {

  @Input() _Employee:Employee;
  _Url : string = '';



  delete() {
    let index = this._BL._Kindergarten.employee_list.indexOf(this._Employee);

    if (index !== -1) {
      console.log('deleteing item');
      console.log(this._BL._Kindergarten.employee_list);
      this._BL._Kindergarten.employee_list.splice(index, 1);
      console.log(this._BL._Kindergarten.employee_list);
      this._BL.SaveKindergarten().subscribe();
    }
  }


  ngOnInit() {
    console.log('Hello Employee');

    jQuery('.EmployeeComponent')

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
      })
    // .transition('bounce', '2000ms')

  }

  ngOnDestroy() {

  }

  constructor(private _BL: Bl) {


    if ( _BL._DebugMode){
      this._Url  = _BL._UploadUrl;
     
    }

  }

}
