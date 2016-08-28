import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';

@Component({
	selector: 'about-item',
	templateUrl: './AboutItemComponent.component..html',
	directives: [...ROUTER_DIRECTIVES],
	styleUrls: ['./AboutItemComponent.component.css']
})
export class AboutItemComponent implements OnInit {

	id: any;
	paramsSub: any;

	ngOnInit() {
		console.log('Hello AboutItemComponent');
		this.paramsSub = this.activatedRoute.params.subscribe(params => this.id = +params['id']);
	}

	ngOnDestroy() {
		this.paramsSub.unsubscribe();
	}

	constructor(private activatedRoute: ActivatedRoute) { }



}
