import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';



@Component({
  selector: 'my-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class AboutComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
   
  }

}
