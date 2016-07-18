import { Component } from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import { Router, ROUTER_DIRECTIVES, RouteParams }  from 'angular2/router';
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
	selector: "Profile",
    templateUrl: 'app/components/profiles/profile/profile.component.html'
})

export class ProfileComponent {
	photos: any = [];
	username: string = '';
	lastname: string = '';
	firstname: string = '';
	website: string;
	location: string;
	bio: string;
	photoSelected: boolean = true;
	likeSelected: boolean = false;
	photoCounter: number = null;
	likeCounter: number = null;
	noPhotos: boolean = false;
	currentUser: boolean = null;

	constructor(private _params: RouteParams, private _http: Http, private _router: Router){
		console.log(_params.get('id'));
		if(_params.get('likes') == 'true'){this.photoSelected = false; this.likeSelected = true}
		var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + getToken(),
            'username': _params.get('id'),
            'type': _params.get('likes') || 'photos'
        });
        console.log(headers);
        console.log(this.currentUser);
		this._http.post('http://localhost:3000/api/user','', {headers: headers}).subscribe(data => {
			console.log(data.json());
			if (data.json().username === localStorage.getItem('user')){this.currentUser = true; this.username =localStorage.getItem('user')};
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
					var photoData = { photo: 'data:image/jpeg;base64,' + data.json().photos[i][1].data, 
									  user: {
									  		  name: data.json().photos[i][0].data.firstname + " " + data.json().photos[i][0].data.lastname,
									  		  username: data.json().photos[i][0].data.username
									  },
									  likes: data.json().photos[i][2],
									  photoID: data.json().photos[i][3],
									  liked: data.json().photos[i][4] || false
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
        })
	}
	photoView(){
		this._router.parent.navigateByUrl('/' + this.username);
		console.log('photoview clicked');
	}
	likeView(){
		this._router.parent.navigateByUrl('/' + this.username +'?likes=true');
		console.log('likeview clicked');
	}
}