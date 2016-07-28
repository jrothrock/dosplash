import { Component } from 'angular2/core';
import { Router, ROUTER_DIRECTIVES }  from 'angular2/router';
import { PhotoComponent } from '../../photos/PhotoComponent';
import {AuthService} from '../../../services/auth.service';

@Component({
	selector: "Home",
    templateUrl: 'app/components/home/featured/featured.component.html',
    directives: [PhotoComponent]
})
export class FeaturedComponent {
	loggedIn = false;
	register = true;
	constructor(private _router: Router, private _auth: AuthService) {
	}

	submit(){
		if(this._auth.isLoggedIn.check){
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