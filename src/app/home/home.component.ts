import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';


declare var jQuery;


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class HomeComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
	  console.log('Hello HomeComponent');


    jQuery('.special.cards .image').dimmer({
      on: 'hover'
    });
  }

}
