import { Component } from 'angular2/core';
import { Http, Headers } from 'angular2/http';
import { Router, ROUTER_DIRECTIVES, RouteParams }  from 'angular2/router';
import {User} from '../../../models/user';
import {AuthService} from '../../../services/auth.service';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
import { HomeComponent } from '../../home/HomeComponent';

@Component({
	selector: "SignIn",
    templateUrl: 'app/components/auth/signIn/signIn.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        FORM_DIRECTIVES
    ],
    providers: [AuthService, HomeComponent]
})
export class SignInComponent {
    usercreds:User
    submitted:boolean;
    submit: boolean;

	constructor(private _http: Http, private _homeComponent:HomeComponent, private _router: Router, private _authservice: AuthService, private _params: RouteParams) {
        this.usercreds = new User('','','','','');
        this.submitted = false;
        this.submit = !!_params.get('submit'); //cast to boolean for 'need to login' message in template
    }
    error = false;
    login() {
    	console.log(this.usercreds);
        this._authservice.login(this.usercreds).then(data => {
        	console.log(data);
            if(data){
                if(this.submit){
                    this._router.navigateByUrl('/submit');
                    return true;
                } 
                this._router.navigateByUrl('/');
                return true;
            }
            this.error = true;      
        })
    }

   signup() {
       if(this.submit){
            this._router.parent.navigateByUrl('/signup?submit=true');
            return true;
       }
    this._router.parent.navigateByUrl('/signup');
  }

}