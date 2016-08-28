import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'about-home',
	templateUrl: './AboutHomeComponent.component.html',
	styleUrls: ['./AboutHomeComponent.component.css']
})
export class AboutHomeComponent implements OnInit {
	
	ngOnInit() {
		console.log('Hello AboutHomeComponent');
		
	}

	ngOnDestroy() {
		
	}

	constructor() { }
	
}
