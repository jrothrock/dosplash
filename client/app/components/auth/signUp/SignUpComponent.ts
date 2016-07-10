import { Component } from 'angular2/core';
import { Http, Headers } from 'angular2/http';
import { Router, ROUTER_DIRECTIVES }  from 'angular2/router';
import {User} from '../../../models/user';
import {AuthService} from '../../../services/auth.service';
import {NgClass, NgForm} from 'angular2/common';

@Component({
	selector: "SignUn",
    templateUrl: 'app/components/auth/signUp/signUp.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        NgClass
    ],
    providers: [AuthService]
})
export class SignUpComponent {
	model:User;

	constructor(
        private _authService: AuthService,
        private _router: Router
    ){ 
        this.model = new User('','','');
    }
    submitted = false;
    success = false;
    error = null;

    handleSubmit = function (model) {
        console.log(model);
        this.submitted = true;
        this.success = false;
        this.error = null;
        this._authService.register(model)
        	.then(data => {
        		console.log(data);
            if(data){
            	this.success = false; 
                this.error = true;
                this._router.navigate(['Home']);
          }      
        });

    }
}