import {Component, OnInit} from '@angular/core';
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload';
import {FORM_DIRECTIVES} from "@angular/forms";
import {CORE_DIRECTIVES, NgStyle, NgClass} from "@angular/common";
import {ChildComponent} from '../Child';
import {Bl} from '../../bl';
import {Child, Kindergarten, Responsible} from "../../bl/models";
import {Observable} from "rxjs/Rx";
import {Http} from "@angular/http";
import {Auth} from "../../services/auth.service";
import {Router} from "@angular/router";

declare let jQuery;

@Component({
  selector: 'register-child',
  directives: [FILE_UPLOAD_DIRECTIVES, NgClass, NgStyle, CORE_DIRECTIVES, FORM_DIRECTIVES, ChildComponent],
  templateUrl: './RegisterChild.component.html',
  styleUrls: ['./RegisterChild.component.css']
})
export class RegisterChildComponent implements OnInit {

  public _NewChild = null;
  _SelectedKindergartenList:Kindergarten = null;
  public uploader:FileUploader = new FileUploader({url: '/_ah/upload/ag1kZXZ-Y2tpZC1ja2lkciILEhVfX0Jsb2JVcGxvYWRTZXNzaW9uX18YgICAgIDIxwoM'});
  errorMessage;
  _KindergartenList = [];
  _Responsibles: Responsible[] = [];

  _Name = '';
  _Image = '';
  _BirthDay = '';
  _SelectedBirthDay = '';
  _Gander = '';
  _Loaded : boolean = false;

  _FreshResponsible = new Responsible();

  constructor(private _BL: Bl, public http: Http ,  private auth : Auth, private router : Router) {

    /*if ( ! this.auth.authenticated())
      this.router.navigateByUrl('/');
*/

    this.uploader.onCompleteItem = (fileItem, response, status, headers) => {
      console.info('onSuccessItem', fileItem, response, status, headers);


      this._NewChild.picture = fileItem._xhr.response;
      this._BL._Client.child_list.push(this._NewChild);
      this._BL.SaveClient().subscribe();

      this.uploader.clearQueue();
      this._Loaded = false;
    };

    this._Responsibles = this._BL._Client.responsible_list;
  }

  ShowAddResponsible(){
    jQuery('.ui.modal.AddResponsible')
      .modal('setting', 'transition', 'horizontal flip')
      .modal('show');
  }

  ShowAddChild(){
    jQuery('.ui.modal.Addchild')
      .modal('setting', 'transition', 'horizontal flip')
      .modal('show');
  }

  CreateMap() {
    if (this._SelectedKindergartenList) {
      let url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAA-xUDSw9hKftpDllGQQ_1iSJSnkxEFmY&q=" + this._SelectedKindergartenList.location.city + " " + this._SelectedKindergartenList.location.address + "&key=AIzaSyAm1E4psYUmndC0fhpNk39Ql_3YWyPcTss"
      jQuery('#MapContainer').html("<iframe  width='100%'  height='100%' frameborder='0' style='border:0;min-height: 300px;' src='" + url + "' allowfullscreen></iframe>")
    }
  }

  onChange(obj) {
    for (let i = 0; i <= this._KindergartenList.length; i++) {
      if (this._KindergartenList[i].auth.email == obj) {
        this._SelectedKindergartenList = this._KindergartenList[i];
        this.CreateMap();
        break;
      }
    }
  }

  addChild() {

    debugger;


    var yesterday = new Date(new Date().setDate(new Date().getDate()-1));

    var d = new Date();
    d.setDate(d.getDate() - 1);

    this._NewChild = new Child();
    this._NewChild.name = this._Name;
    this._NewChild.picture = this._Image;
    this._NewChild.birth_day = new Date(this._SelectedBirthDay).toISOString().replace('Z', '0').replace('+', '.');
    this._NewChild.gender = this._Gander;
    this._NewChild.kindergarten_id = this._SelectedKindergartenList.auth.email;
    this._NewChild.in_date = yesterday .toISOString().replace('Z', '0').replace('+', '.')
    this._NewChild.out_date = yesterday .toISOString().replace('Z', '0').replace('+', '.')

    event.preventDefault();
    if (!this._BL._Client.child_list) {
      this._BL._Client.child_list = [];
    }

    if (jQuery('#file').val() != '') {
      this.upload();
    }
    else {
      this._BL._Client.child_list.push(this._NewChild);
      this._BL.SaveClient().subscribe();
    }

  }

  ngOnInit() {



    jQuery('.ui.modal.Addchild')
      .popup({
        inline: true
      })
    ;
    jQuery('#calendar').calendar({
      type: 'date',
      onChange: (val)=> {
        this._SelectedBirthDay = val;
      }
    });

    jQuery('.dropdown')
      .dropdown({
        maxSelections: 1
      });

    this._BL.GetAllKindergarten().subscribe(
      data => {
        this._KindergartenList = data;

        if ( this._KindergartenList ){
          this._SelectedKindergartenList = this._KindergartenList[0];
          this.CreateMap();
          this._Loaded = true;
        }
      } ,
      error => this.errorMessage = <any>error);


  }

  upload() {

    let url = 'uploadKey'
    url =  this._BL._UploadUrl + url;
    //this.http.get('https://ckid-ckid.appspot.com/api/uploadKey')

    this.http.get(url)
      .map(res => res.text())
      .subscribe(
        data => {

          for (let index = 0; index < this.uploader.queue.length; index++) {
            let element = this.uploader.queue[index];
            element.alias = "photo";
            element.url = data;
            element.progress = 0;
          }

          this.uploader.uploadAll();
        },
        err => console.log, // this.logError(err),
        () => console.log(
          'upload Complete'
        )
      );
  }

  addResponsible(){
    this._Responsibles.push(this._FreshResponsible);
    this._FreshResponsible = new Responsible();
  }

  removeResponsible(item: Responsible){
    this._Responsibles.splice(this._Responsibles.indexOf(item),1);
  }



  saveResponsibles(){
    this._BL.SaveClient().subscribe()
  }

  handleError(err: any) {
    return Observable.throw(err);
  }

  extractData(data):Kindergarten {
    return data; // JSON.parse(data._body)[0];
  }


}
