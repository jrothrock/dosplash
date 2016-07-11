import { Component } from 'angular2/core';
import { Router, ROUTER_DIRECTIVES }  from 'angular2/router';

@Component({
	selector: "Home",
    templateUrl: 'app/components/home/home.component.html',
})
export class HomeComponent {
	constructor(private _router: Router) {
	}

	submit(){
		this._router.parent.navigateByUrl('/submit');
	}
}