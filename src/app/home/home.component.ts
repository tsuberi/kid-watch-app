import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { CeiboShare } from 'ng2-social-share';

declare var jQuery;


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  directives: [ROUTER_DIRECTIVES,CeiboShare]
})
export class HomeComponent implements OnInit {

  //public repoUrl = 'https://github.com/Epotignano/ng2-social-share';
  public repoUrl = 'https://www.facebook.com/watchkid/';
  //public imageUrl = 'https://avatars2.githubusercontent.com/u/10674541?v=3&s=200';
  public imageUrl =   'https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-9/14102154_1575376932764110_5975885126046984539_n.jpg?oh=ba013dd69eb2bfda83da042f3cfa34e6&oe=5851786D&__gda__=1482181451_a1d0d61ee37a4ea9167d9fa6c20669ee';




  constructor() {
    // Do stuff
  }

  ngOnInit() {
	 
    jQuery('.special.cards .image').dimmer({
      on: 'hover'
    });
  }

}
