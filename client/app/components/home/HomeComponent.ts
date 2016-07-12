import { Component } from 'angular2/core';
import { Router, ROUTER_DIRECTIVES }  from 'angular2/router';
import { PhotoComponent } from '../photos/PhotoComponent';

@Component({
	selector: "Home",
    templateUrl: 'app/components/home/home.component.html',
    directives: [PhotoComponent]
})
export class HomeComponent {
	loggedIn = false;
	register = true;
	constructor(private _router: Router) {

	}
	submit(){
		if(localStorage.getItem('token')){
			this._router.parent.navigateByUrl('/submit');
			return true;
		}
		this.register = true;
		this._router.parent.navigateByUrl('/signin?submit=true');
	}
	registered(){
		return this.register;
	}
}