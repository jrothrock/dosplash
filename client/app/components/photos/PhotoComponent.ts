import { Component, OnInit } from 'angular2/core';
import { Router, RouteParams }  from 'angular2/router';
import {Http, Headers} from 'angular2/http';

//cache the photos to minimize db requests
var photoFeaturedData = {
    	allPhotos: [],
    	setData: function(data1){
    		this.allPhotos = data1;
    		console.log('allPhotos = ' + this.allPhotos);
    	},

    	getData: function(){
    		return this.allPhotos;
    	},
}

var photoNewData = {
    	allPhotos: [],
    	setData: function(data1){
    		this.allPhotos = data1;
    		console.log('allPhotos = ' + this.allPhotos);
    	},

    	getData: function(){
    		return this.allPhotos;
    	},
}

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
	selector: "PhotoDetail",
	inputs: ['parent'],
    templateUrl: 'app/components/photos/photo.component.html',
})
export class PhotoComponent {
	parent: boolean = false; //is false if route is featured (/) and new if route is new (/new)
	photos: any = [];
	noPhotos: boolean;
	photosSet: any;
	change:boolean = false;
	submit: boolean = false;
	loggedOut: boolean = false;
	registered: boolean = false;
	firstname: string = '';
	lastname: string = '';
	signIn: boolean = false;
	logout:boolean = false;
	login:boolean = false;

	/*
	This constructor would be used if pulling photos from the filesystem - uncomment this code
	and the commented code in the routes photos.js to start pulling photos from the file system.

	constructor(private _http: Http) {
		this._http.get('http://localhost:3000/api/photos').subscribe(data => {
			if(data.json().photos.length == 0){
				this.noPhotos = true;
			}else{
				this.noPhotos = false;
				this.photos = data.json().photos;
			}
        })
    }

    */


    constructor(private _http: Http, private _params: RouteParams, private _router: Router) {
    }

    ngOnInit(){
    	console.log(this.parent);
    	if(this._params.get('message') === 'submit'){
    		this.submit = true;
    		this.change = true;
    	} else if (this._params.get('message') === 'false'){
    		this.loggedOut = true;
    		this.change = true;
    	}
 		else if(this._params.get('message') === 'login'){
 			this.firstname = localStorage.getItem('first');
    		this.lastname = localStorage.getItem('last');
 			this.login = true;
 			this.change = true;
 		}
 		else if(this._params.get('message') === 'logout'){
 			this.logout = true;
 			this.change = true;
 		}
    	else if (this._params.get('message') === 'register'){
    		this.registered = true;
    		this.firstname = localStorage.getItem('first');
    		this.lastname = localStorage.getItem('last');
    		this.change = true;
    	}
    	console.log(photoFeaturedData.getData().length);
    	if(this.change || (!this.parent && photoFeaturedData.getData().length === 0) || (this.parent && photoNewData.getData().length === 0)){
    		this.photosSet = [];
    		var headers = new Headers({
            	'Content-Type': 'application/x-www-form-urlencoded',
            	'Authorization': 'Bearer ' + getToken(),
            	'Filter': this.parent
        	});
			this._http.get('http://localhost:3000/api/photos', {headers: headers}).subscribe(data => {
				console.log(data.json());
				if(!data.json().photos){
					this.noPhotos = true;
					return true;
				}else{
					this.noPhotos = false;
					for(var i = 0; i < data.json().photos.length; i++){
						var indPhoto = {
							name: data.json().photos[i][0],
							user: data.json().photos[i][1],
							photo: 'data:image/jpeg;base64,' + data.json().photos[i][2],
							photoID: data.json().photos[i][3], 
							likes: data.json().photos[i][4],
							liked: data.json().photos[i][5] || false
						}
						console.log(indPhoto);
						this.photosSet.push(indPhoto);
						if(i === (data.json().photos.length - 1)){
							console.log("photoset = " + this.photosSet);
					        if(this.parent){
					        	photoNewData.setData(this.photosSet);
					        } else {
					        	photoFeaturedData.setData(this.photosSet);
					        }
					        this.photos = this.photosSet;
					        console.log('photos ' +  this.photos);
					        console.log(this.photos.length);
						}
					}
				}
	        })
	    }
	    else{
	    	if(this.parent){
	    		this.photos = photoNewData.getData();
	    	} else {
	    		this.photos = photoFeaturedData.getData();
	    	}
	    }
    }

    userLink(user){
    	//this is the dirtiest monkey patch. location.path() is async, or something.
    	window.localStorage.setItem('userLink', user);
    	this._router.navigate(['Profile', 'Profile', {id: user}]);
    }

    download(photo, name){
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
	    else if ( !! window.ActiveXObject && document.execCommand) {
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
}