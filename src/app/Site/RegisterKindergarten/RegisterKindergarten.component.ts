import {Component, OnInit, NgZone} from '@angular/core';
import {Bl} from '../../bl';
import {EmployeeComponent} from '../Employee';
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Auth} from "../../services/auth.service";
import {FORM_DIRECTIVES} from "@angular/forms";
import {CORE_DIRECTIVES, NgStyle, NgClass} from "@angular/common";
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from "ng2-file-upload/ng2-file-upload";
import {Kindergarten, Employee} from "../../bl/models";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";

declare var jQuery;


@Component({
  selector: 'register-kindergarten',
  directives: [EmployeeComponent,FILE_UPLOAD_DIRECTIVES, NgClass, NgStyle, CORE_DIRECTIVES, FORM_DIRECTIVES,ROUTER_DIRECTIVES],
  providers: [ Auth],
  templateUrl: './RegisterKindergarten.component.html',
  styleUrls: ['./RegisterKindergarten.component.css'],
 /*  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition("void =>  enter", [
        style({opacity: 0, transform: "translateX(5%)"}),
        animate("200ms ease-in-out")
      ]),
      transition("* => leave", [
        style({opacity: 1, transform: "translateX(0)"}),
        animate("200ms ease-in-out")
      ])
    ])
  ]*/

})
export class RegisterKindergartenComponent implements OnInit {


  public uploader:FileUploader = new FileUploader({url: 'http://ckid-ckid.appspot.com/_ah/upload/ag1kZXZ-Y2tpZC1ja2lkciILEhVfX0Jsb2JVcGxvYWRTZXNzaW9uX18YgICAgIDIxwoM'});

  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
  zone: NgZone;

  public _NewEmp = null;
  public state  = 'in';

  _EmployeeName = '';
  _EmployeePosition = '';
  _EmployeePhone = '';
  _EmployeeCity = '';
  _EmployeeAddress = '';
  _EmployeeEmail = '';
  _EmployeeExperience = '';
  _EmployeeImage = '';
  _OpeningTime = '';
  _ClosingTime = '';
  _GMT : number = 3;







  constructor(private _BL:Bl, public http:Http, private auth:Auth , private router : Router) {

/*
    if ( ! this.auth.authenticated())
      this.router.navigateByUrl('/');*/

    this.uploader.onCompleteItem  = (fileItem, response, status, headers) =>{
      console.info('onSuccessItem', fileItem, response, status, headers);

      this._NewEmp.image = fileItem._xhr.response;
      this._BL._Kindergarten.employee_list.push(this._NewEmp);
      this._BL.SaveKindergarten().subscribe();
      this.uploader.clearQueue();
    };
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }


  logout() {
    /*if (this.auth.authenticated()) {
     this.auth.logout();
     }*/
    this._BL.Logout();

  }

  upload()
  {
    let url = 'uploadKey'

    url =  this._BL._UploadUrl + url;

    this.http.get(url)
      .map(res => res.text())
      .subscribe(
        data =>  {

          for (var index = 0; index < this.uploader.queue.length; index++) {
            var element = this.uploader.queue[index];
            element.alias = "photo";
            element.url = data;
            element.progress = 0;
          }

          this.uploader.uploadAll();
        } ,
        err => console.log, // this.logError(err),
        () => console.log(
          'upload Complete'
        )
      );
  }

  handleError(err:any) {
    return Observable.throw(err);
  }

  extractData(data):Kindergarten {
    return data; // JSON.parse(data._body)[0];
  }

  addEmployee() {

    if (!this.auth.authenticated()) {
      this.auth.login();
      return;
    }



    this._NewEmp = new Employee();
    this._NewEmp.location.country = 'Israel';
    this._NewEmp.location.city = this._EmployeeCity;
    this._NewEmp.location.address = this._EmployeeAddress;
    this._NewEmp.name = this._EmployeeName;
    this._NewEmp.position = this._EmployeePosition;
    this._NewEmp.cellPhone = this._EmployeePhone;
    this._NewEmp.email = this._EmployeeEmail;
    this._NewEmp.image = this._EmployeeImage;
    this._NewEmp.experience = this._EmployeeExperience;



    if ( ! this._BL._Kindergarten.employee_list )
      this._BL._Kindergarten.employee_list = [];


    if ( jQuery('#file').val() != '')
    {
      this.upload();
    }
    else {
      this._BL._Kindergarten.employee_list.push(this._NewEmp);
      this._BL.SaveKindergarten().subscribe();
    }
  }

  ngOnInit() {
   /* if (!this.auth.authenticated())
      this.auth.login()

*/
    jQuery('#_sunday_opeing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.sunday_opeing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_sunday_closing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.sunday_closing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_monday_opeing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.monday_opeing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_monday_closing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.monday_closing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_tuesday_opeing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.tuesday_opeing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_tuesday_closing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.tuesday_closing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_wednesday_opeing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.wednesday_opeing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_wednesday_closing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.wednesday_closing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_thursday_opeing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.thursday_opeing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_thursday_closing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.thursday_closing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_friday_opeing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.friday_opeing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_friday_closing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.friday_closing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_saturday_opeing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.saturday_opeing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_saturday_closing_time').calendar({
      type: 'time',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.schedule.saturday_closing_time = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });


    jQuery('#_event_start_date').calendar({
      type: 'date',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.holyday.holyday_start_dete = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    jQuery('#_event_end_date').calendar({
      type: 'date',
      ampm: false,
      onChange: (val)=> {
        this._BL._Kindergarten.holyday.holyday_end_dete = new Date(val).toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      }
    });

    




    jQuery('.dropdown')
      .dropdown({
        maxSelections: 1
      });

    jQuery('.EmployeeComponent')
    //.transition('swing down')
    //.transition('swing down')
      .show("slow")
      .transition({
        animation : 'scale',
        duration  : 100,
        interval  : 100
      })

      .transition({
        animation : 'scale',
        duration  : 1000,
        interval  : 100
      })




  }

  ngOnDestroy() {
  }

  save(){



    this._BL.SaveKindergarten().subscribe();
  }
}
