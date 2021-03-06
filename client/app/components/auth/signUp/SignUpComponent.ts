import {Component, Input} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
import {Http} from 'angular2/http';

import { Router, ROUTER_DIRECTIVES, RouteParams }  from 'angular2/router';
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
  firstname: Control;
  lastname: Control;
  username: Control;
  email: Control;
  password: Control;
  submitAttempt: boolean = false;
  submit: boolean;
  success: boolean = false;
  error: boolean = null;

	constructor(private http: Http, private builder: FormBuilder, private _authService: AuthService, private _router: Router, private _params: RouteParams) {
  }

  ngOnInit(){
    this.firstname = new Control('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z-]*$')]));
    this.lastname = new Control('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z-]*$')]));
    this.username = new Control('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$')]));
    this.email = new Control('', Validators.compose([Validators.required, Validators.pattern('[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?')]));
    this.password = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]));

    this.registrationForm = this.builder.group({
      firstname: this.firstname,
      lastname: this.lastname,
      username: this.username,
      email: this.email,
      password: this.password
    });
    this.submit = !!this._params.get('submit'); //cast to boolean for 'need to login' message in template
  }

    registerUser(User) {
        this.submitAttempt = true;
        if(
         User.password.length > 5 
         && /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(User.email)
         && /^[a-zA-Z0-9_]*$/.test(User.username)
         && /^[a-zA-Z]*$/.test(User.firstname)
         && /^[a-zA-Z]*$/.test(User.lastname)){

        
        console.log(User);
        this.error = null;
        this._authService.register(User)
        	.then(data => {
        	console.log(data);
            if(data){
               this.error = false;
               if(this.submit){
                 this._router.navigate(['Submit']);
                 return true;
               }
                this._router.parent.navigateByUrl('/?message=register');
                return true;
            }
            this.error = true;
        });
       }
    }

    signin() {
      if(this.submit){
        this._router.parent.navigateByUrl('/signin?submit=true');
        return true;
      }
      this._router.parent.navigateByUrl('/signin');
    }
}