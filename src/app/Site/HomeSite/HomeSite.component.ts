import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'my-home-site',
  templateUrl: './HomeSite.component.html',
  styleUrls: ['./HomeSite.component.css']
})
export class HomeSiteComponent implements OnInit {

  ngOnInit() {
    console.log('Hello HomeSiteComponent');

  }

  ngOnDestroy() {

  }

  constructor() {
  }
}
