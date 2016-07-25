import { Component, OnInit, OnChanges } from 'angular2/core';
import { Http, Headers } from 'angular2/http';
import { Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams, CanActivate, Location }  from 'angular2/router';
import { ProfileLikesPhotosComponent } from '../profilePhotos/likes/ProfileLikesPhotosComponent';
import { ProfilePhotosComponent } from '../profilePhotos/photos/ProfilePhotosComponent';

var getToken = function() {
        return localStorage.getItem('token') || '';
}
var voteData = {
	type: null,
	setType: function(newtype){
		this.type = newtype;

	},
	getType: function(){
		return this.type;
	}
}
var currentUserData = {
	name: null,
	setName: function(name){
		this.name = name;
	},
	getName: function(){
		return this.name;
	}
}

@Component({
	selector: "Profile",
    templateUrl: 'app/components/profiles/profile/profile.component.html',
    //template: `<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/:id', name: 'Profile', component: ProfilePhotosComponent, useAsDefault: true},
    { path: '/:id/likes', name: 'Likes', component: ProfileLikesPhotosComponent},
])

export class ProfileComponent {
	photos: any = [];
	username: string = '';
	lastname: string = '';
	firstname: string = '';
	website: string;
	location: string;
	bio: string;
	photoCounter: number = null;
	likeCounter: number = null;
	noPhotos: boolean = false;
	currentUser: boolean = null;
	signIn: boolean = false;
	photosView: boolean = true;
	likesView: boolean = false;

	constructor(private _params: RouteParams, private _http: Http, private _router: Router, private _location: Location){
	}

	ngOnInit(){
		// this is the dirtiest monkey patch. location.path() is null the first time, not sure if it's async or not.
		// This is from using the child route config.
		console.log('currentUserData = ' + currentUserData.getName());
		console.log('splitting = ' + this._location.path().split('/').slice(1)[0]);
		console.log('storeage userLink = ' + localStorage.getItem('userLink'));
		console.log('storeage user = ' + localStorage.getItem('user'));
		var userLink = localStorage.getItem('userLink') || false;
		console.log(this._location.path().split('/').slice(1)[0]);
		var locationSplit;
		if(this._location.path().split('/').slice(1)[0]){
			locationSplit = (this._location.path().split('/').slice(1)[0].charAt(0) === '@')? this._location.path().split('/').slice(1)[0]: false;
		}
		console.log('locationSplit = '+ locationSplit);
		var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + getToken(),
            'username': locationSplit || userLink || localStorage.getItem('user'),
            'type': this.likesView || 'photos'
        });
        currentUserData.setName(userLink);
        //console.log(this._params.get('id'));
        //console.log(localStorage.getItem('user'));
        console.log('these headers = ' + headers);
        this.username = this._params.get('id')
        //console.log(this.currentUser);
		this._http.post('http://localhost:3000/api/user/info','', {headers: headers}).subscribe(data => {
			console.log(data.json());
			if (data.json().username === localStorage.getItem('user')){this.currentUser = true};
			//console.log(this.currentUser);
			if(data.json().nouser){
					
			}else{
				this.noPhotos = false;
					this.lastname = data.json().lastname;
					this.firstname = data.json().firstname;
					this.username = data.json().username;
					this.website = data.json().website;
					this.location = data.json().location;
					this.bio = data.json().bio;
					this.photoCounter = data.json().photosLength;
					this.likeCounter = data.json().likesLength;
			}
			if(this.photoCounter === 0){
				//console.log('photoCounter = '+this.photoCounter);
				//this.LikesLink();
			}
		})
	}
	getLinkStyle(path:string):boolean {
		return this._location.path() === path;
	}
	submit(){
		this._router.parent.navigateByUrl('/submit');
	}
	form(){
		this._router.navigate(['ProfileForm',{id:this.username}]);
	}
	userLink(user){
    	this._router.parent.navigateByUrl('/' + user);
    }
    download(photo){
    	//for non IE 
	    if (!window.ActiveXObject) {
	        var save = document.createElement('a');
	        save.href = photo;
	        save.target = '_blank';
	        save.download = 'unknown';

	        var event = document.createEvent('Event');
	        event.initEvent('click', true, true);
	        save.dispatchEvent(event);
	        (window.URL || window.webkitURL).revokeObjectURL(save.href);
	    }

	    // for IE
	    else if ( !! window.ActiveXObject && document.execCommand)     {
	        var _window = window.open(photo, '_blank');
	        _window.document.close();
	        _window.document.execCommand('SaveAs', true, "unknown")
	        _window.close();
	    }
	}
    like(id,index,type){
		var voteType = voteData.getType() || type;
		console.log(voteType);
		console.log('clicked ' + id);
		console.log('index ' + index);
		var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
        var creds = "photo=" + id + "&type=" + voteType;
        
        this._http.post('http://localhost:3000/api/vote', creds, {headers: headers}).subscribe(data => {
        	console.log(data.json());
        	if(data.json().success){
        		voteData.setType(!voteType);
        		var elementText = document.getElementById("likes-" + index);
            	elementText.innerHTML = data.json().data.likes.num;
        	}
        	if(data.json().success && (data.json().type === 'upvote')){
            	var elementIcon = document.getElementById("icon-likes-" + index);
            	elementIcon.className += ' liked-icon';
            	var elementButton = document.getElementById("likes-button-" + index);
            	elementButton.className += ' liked';
            }
            if(data.json().success && (data.json().type === 'downvote')){
            	var elementIcon = document.getElementById("icon-likes-" + index);
            	elementIcon.className = 'fa fa-heart';
            	var elementButton = document.getElementById("likes-button-" + index);
            	elementButton.className += 'btn btn-default';
            }
            if(!data.json().user && data.json().destroy){
            	this.signIn = true;
            	window.localStorage.clear();
            }
        })
	}
	PhotoLink(){
		this._router.parent.navigateByUrl('/' + this.username);
		this.photosView = true;
		this.likesView = false;
	}
	LikesLink(){
		this._router.parent.navigateByUrl('/' + this.username + '/likes' );
		this.photosView = false;
		this.likesView = true;
		// this._router.navigate(['Profile', 'Profile', {id:this.username}, 'Likes']);
	}
}