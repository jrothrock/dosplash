import { Component, OnInit } from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {UserProfile} from '../../../models/user.profile';
import { RouteParams, Router }  from 'angular2/router';
@Component({
	selector: "ProfileForm",
    templateUrl: 'app/components/profiles/profileForm/profileForm.component.html',
})

export class ProfileFormComponent {
	model:UserProfile;
	firstname:string = '';
	lastname:string = '';
	
	constructor(private _params: RouteParams, private _http: Http, private _router: Router){
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
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
        console.log(model);
        console.log(localStorage.getItem('token'));
        console.log(headers);
        var creds = "website=" + model.website + "&location=" + model.location + "&bio=" + model.bio;
        console.log(creds);
        this._http.post('http://localhost:3000/api/userInfo', creds, {headers: headers}).subscribe(data => {
        	if(data.json().success){
        		this._router.navigate(['Profile', {id:localStorage.getItem('user')}]);
        	}
        });
	}
}