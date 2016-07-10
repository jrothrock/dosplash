import { Component } from 'angular2/core';
import { Http, Headers } from 'angular2/http';
import { Router, ROUTER_DIRECTIVES }  from 'angular2/router';
import {User} from '../../../models/user';
import {AuthService} from '../../../services/auth.service';
import {NgClass, NgForm} from 'angular2/common';

@Component({
	selector: "SignIn",
    templateUrl: 'app/components/auth/signIn/signIn.component.html',
        directives: [
        ROUTER_DIRECTIVES,
        NgClass
    ],
    providers: [AuthService]
})
export class SignInComponent {
    usercreds:User
    submitted:boolean;
	constructor(private _http: Http, private _router: Router, private _authservice: AuthService) {
        this.usercreds = new User('','','');
        this.submitted = false;
    }
    error = false;
    login() {
    	console.log(this.usercreds);
        this._authservice.login(this.usercreds).then(data => {
        	console.log(data);
            if(data){
                this._router.navigateByUrl('/');
          }      
        })
    }

   signup() {
    this._router.parent.navigateByUrl('/signup');
  }

}