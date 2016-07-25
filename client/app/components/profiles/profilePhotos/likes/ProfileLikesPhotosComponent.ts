import { Component, OnInit, OnChanges } from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import { Router, ROUTER_DIRECTIVES, RouteParams, Location }  from 'angular2/router';

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

@Component({
	selector: "ProfileLikePhotos",
    templateUrl: 'app/components/profiles/profilePhotos/likes/profileLikesPhotos.component.html'
})
export class ProfileLikesPhotosComponent {
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
	likesView: boolean = true;


	constructor(private _params: RouteParams, private _http: Http, private _router: Router, private _location: Location){
	}

	ngOnInit(){
		console.log('splitting2 = ' + this._location.path().split('/').slice(1)[0]);
		console.log('storeage2 userLink = ' + localStorage.getItem('userLink'));
		console.log('storeage2 user = ' + localStorage.getItem('user'));
		var userLink = localStorage.getItem('userLink') || false;
		localStorage.removeItem('userLink');
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
        console.log(headers);
        this.username = this._params.get('id')
        //console.log(this.currentUser);
		this._http.post('http://localhost:3000/api/user/photos','', {headers: headers}).subscribe(data => {
			console.log(data.json());
			if (data.json().username === localStorage.getItem('user')){this.currentUser = true};
			console.log(this.currentUser);
			if(!data.json().photos){
					this.noPhotos = true;
					this.lastname = data.json().lastname;
					this.firstname = data.json().firstname;
					this.photoCounter = data.json().photosLength;
					this.likeCounter = data.json().likesLength;
					this.website = data.json().website;
					this.location = data.json().location;
					this.bio = data.json().bio;
					return true;
			}else{
				this.noPhotos = false;
				for(var i = 0; i < data.json().photos.length; i++){
					var photoData = { 
									  name: data.json().photos[i][0],
									  user: {
									  		  name: data.json().photos[i][1].data.firstname + " " + data.json().photos[i][1].data.lastname,
									  		  username: data.json().photos[i][1].data.username
									  },
									  photo: 'data:image/jpeg;base64,' + data.json().photos[i][2].data, 
									  likes: data.json().photos[i][3],
									  photoID: data.json().photos[i][4],
									  liked: data.json().photos[i][5] || false
									};
					this.photos.push(photoData);
					console.log(this.photos);
					this.lastname = data.json().lastname;
					this.firstname = data.json().firstname;
					this.website = data.json().website;
					this.location = data.json().location;
					this.bio = data.json().bio;
					this.photoCounter = data.json().photosLength;
					this.likeCounter = data.json().likesLength;
				}
			}
		})
	}

	userLink(user){
		if(user !== this.username){
	    	window.localStorage.setItem('reRoute', user);
	        this._router.navigateByUrl('/a?route=profile');
	    }
    }
	download(photo,name){
    	//for non IE 
	    if (!window.ActiveXObject) {
	        var save = document.createElement('a');
	        save.href = photo;
	        save.target = '_blank';
	        save.download = name || 'unknown';

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
	getLinkStyle(path:string):boolean {
		return this._location.path() === path;
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