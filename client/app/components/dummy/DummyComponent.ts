/*
	This component does nothing but reroute to the component that routed to this - in order to reload the component. 

*/
import {Component, Input} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
import {Http} from 'angular2/http';

import { Router, ROUTER_DIRECTIVES, RouteParams }  from 'angular2/router';


@Component({
	selector: "SignUn",
    template: ``
})
export class DummyComponent {
	constructor(private _router: Router, private _params: RouteParams){
		if(this._params.get('route') === 'profile' ){
			console.log("re Route = " + localStorage.getItem('reRoute'));
			 this._router.navigate(['Profile', 'Profile', {id: localStorage.getItem('reRoute')}]);
			 localStorage.removeItem('reRoute');
		}
	}
}