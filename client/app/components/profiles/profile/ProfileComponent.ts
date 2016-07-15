import { Component } from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import { Router, ROUTER_DIRECTIVES, RouteParams }  from 'angular2/router';

@Component({
	selector: "Profile",
    templateUrl: 'app/components/profiles/profile/profile.component.html',
})

export class ProfileComponent {
	photos: any = [];
	username: string = '';
	lastname: string = '';
	firstname: string = '';
	website: string = '';
	location: string = '';
	bio: string = '';
	photoCounter: number = null;
	noPhotos: boolean = false;
	currentUser: boolean = false;

	constructor(private _params: RouteParams, private _http: Http, private _router: Router){
		console.log(_params.get('id'));
		var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'username': _params.get('id')
        });
        console.log(headers);
		this._http.post('http://localhost:3000/api/user','', {headers: headers}).subscribe(data => {
			console.log(data.json());
			if (data.json().username === localStorage.getItem('user')){this.currentUser = true; this.username =localStorage.getItem('user')};
			if(!data.json().photos){
					this.noPhotos = true;
					return true;
			}else{
				this.noPhotos = false;
				for(var i = 0; i < data.json().photos.length; i++){
					var src = 'data:image/jpeg;base64,' + data.json().photos[i];
					this.photos.push(src);
					this.lastname = data.json().lastname;
					this.firstname = data.json().firstname;
					this.website = data.json().website;
					this.location = data.json().location;
					this.bio = data.json().bio;
					this.photoCounter = this.photos.length;
				}
			}
		})
	}

	submit(){
		this._router.parent.navigateByUrl('/submit');
	}
	form(){
		this._router.navigate(['ProfileForm',{id:this.username}]);
	}
}