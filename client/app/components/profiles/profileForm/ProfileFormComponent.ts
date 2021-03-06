import { Component, OnInit } from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
import {UserProfile} from '../../../models/user.profile';
import { RouteParams, Router }  from 'angular2/router';
import {AuthService} from '../../../services/auth.service';

@Component({
	selector: "ProfileForm",
    templateUrl: 'app/components/profiles/profileForm/profileForm.component.html',
    directives: [
        FORM_DIRECTIVES
    ]
})

export class ProfileFormComponent {
	model:UserProfile;
	firstname:string = '';
	lastname:string = '';
	
	constructor(private _params: RouteParams, private _http: Http, private _router: Router, private _auth: AuthService){
	}

	ngOnInit(){
		if(localStorage.getItem('user') === this._params.get('id')){
			this.model = new UserProfile('','','');
			this.firstname = localStorage.getItem('first');
			this.lastname = localStorage.getItem('last');
			console.log(this._params.get('id'));
	    } else {
	  		this._router.parent.navigateByUrl('/?message=unauthorized');
	  	}
	}

	handleSubmit(model) {
		var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this._auth.isLoggedIn.getCookie()
        });
        console.log(model);
        console.log(localStorage.getItem('token'));
        console.log(headers);
        var creds = "website=" + model.website + "&location=" + model.location + "&bio=" + model.bio;
        console.log(creds);
        this._http.post('http://localhost:3000/api/userInfo', creds, {headers: headers}).subscribe(data => {
        	if(data.json().success){
        		this._router.navigate(['Profile', 'Profile', {id:localStorage.getItem('user')}]);
        	}
        });
	}
}