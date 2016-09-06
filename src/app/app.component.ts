import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {ApiService} from './shared';
import '../style/app.css';

declare var jQuery;
@Component({
  selector: 'my-app',
  providers: [ApiService],
  directives: [...ROUTER_DIRECTIVES],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  url = 'https://github.com/preboot/angular2-webpack';
  constructor(private api: ApiService ) {}
  ngOnInit() {



  }
}

