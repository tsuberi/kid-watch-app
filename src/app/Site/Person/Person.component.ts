import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'person',
	templateUrl: './Person.component.html',
	styleUrls: ['./Person.component.css']
})
export class PersonComponent implements OnInit {

	ngOnInit() {
		console.log('Hello Person');

	}

	ngOnDestroy() {

	}

	constructor() { }

}
