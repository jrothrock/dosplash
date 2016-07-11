import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
import {Http} from 'angular2/http';

import { Router, ROUTER_DIRECTIVES }  from 'angular2/router';
import {User} from '../../../models/user';
import {AuthService} from '../../../services/auth.service';
@Component({
	selector: "SignUn",
    templateUrl: 'app/components/auth/signUp/signUp.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        FORM_DIRECTIVES
    ],
    providers: [AuthService]
})
export class SignUpComponent {
 registrationForm: ControlGroup;
  username: Control;
  email: Control;
  password: Control;
  submitAttempt: boolean = false;

	constructor(private http: Http, private builder: FormBuilder, private _authService: AuthService, private _router: Router) {

    this.username = new Control('', Validators.required)
    this.email = new Control('', Validators.compose([Validators.required, Validators.pattern('[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?')]))
    this.password = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]));

    this.registrationForm = builder.group({
      username: this.username,
      email: this.email,
      password: this.password
    });
  }

    submitted = false;
    success = false;
    error = null;

    registerUser = function (User) {
        this.submitAttempt = true;
        if(User.password.length > 5 && /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(User.email)){

        
        console.log(User);
        this.submitted = true;
        this.success = false;
        this.error = null;
        this._authService.register(User)
        	.then(data => {
        	console.log(data);
            if(data){
            	this.success = true; 
                this.error = false;
                this._router.navigate(['Home']);
            } else{
                this.error = true;
            }    
        });
       }
    }
}