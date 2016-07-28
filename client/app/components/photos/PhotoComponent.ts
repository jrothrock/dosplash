import { Component, OnInit } from 'angular2/core';
import { Router, RouteParams }  from 'angular2/router';
import {Http, Headers} from 'angular2/http';
import {PhotoService} from '../../services/photo.service';
import {AuthService} from '../../services/auth.service';
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



@Component({
	selector: "PhotoDetail",
	inputs: ['parent'],
    templateUrl: 'app/components/photos/photo.component.html',
    providers:[PhotoService]
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
	noUser:boolean = false;

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


    constructor(private _http: Http, private _params: RouteParams, private _router: Router, private _photoService: PhotoService, private _auth: AuthService) {
    }

    ngOnInit(){
    	console.log(this.parent);
    	if(this._params.get('message') === 'submit'){
    		this.submit = true;
    		this.change = true;
    	} 
    	else if (this._params.get('message') === 'false'){
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
    	else if (this._params.get('message') === 'noUser'){
    		this.noUser = true;
    	}
    	console.log(photoFeaturedData.getData().length);
    	if(this.change || (!this.parent && photoFeaturedData.getData().length === 0) || (this.parent && photoNewData.getData().length === 0)){
    		this.photosSet = [];
    		var headers = new Headers({
            	'Content-Type': 'application/x-www-form-urlencoded',
            	'Authorization': 'Bearer ' + this._auth.isLoggedIn.getCookie(),
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
    	this._photoService.download(photo,name);
	}

	like(id,index,type){
		this._photoService.like(id,type)
        .then(data => {
        	if(data.success){
        		var elementText = document.getElementById("likes-" + index);
            	elementText.innerHTML = data.data.likes.num;
            	var before = this.photos[index].liked;
            	this.photos[index].liked = !this.photos[index].liked;
            	this.photos[index].likes = data.data.likes.num;
            	if(this.parent){
	    			photoNewData.setData(this.photos);
	    		} else {
	    			photoFeaturedData.setData(this.photos);
	    		}
        	}
        	if(data.success && (data.type === 'upvote')){
            	var elementIcon = document.getElementById("icon-likes-" + index);
            	elementIcon.className += ' liked-icon';
            	var elementButton = document.getElementById("likes-button-" + index);
            	elementButton.className += ' liked';
            }
            if(data.success && (data.type === 'downvote')){
            	var elementIcon = document.getElementById("icon-likes-" + index);
            	elementIcon.className = 'fa fa-heart';
            	var elementButton = document.getElementById("likes-button-" + index);
            	elementButton.className += 'btn btn-like';
            }
            if(!data){
            	this.signIn = true;
            }
        })
	}

	setChange(index,liked,likes){
		this.photos = this.parent? photoNewData.getData() : photoFeaturedData.getData();
		console.log(this.photos);
		if(this.photos.length){
			this.photos[index].liked = liked;
			this.photos[index].likes = likes;
			if(this.parent){
		    	photoNewData.setData(this.photos);
		   	} else {
		    	photoFeaturedData.setData(this.photos);
		    }
		}
	}
}