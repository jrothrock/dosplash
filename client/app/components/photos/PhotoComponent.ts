import { Component } from 'angular2/core';
import { Router, RouteParams }  from 'angular2/router';
import {Http, Headers} from 'angular2/http';

//cache the photos to minimize db requests
var photoData = {
    	allPhotos: [],
    	setData: function(data1){
    		this.allPhotos = data1;
    		console.log('allPhotos = ' + this.allPhotos);
    	},

    	getData: function(){
    		return this.allPhotos
    	},
}

@Component({
	selector: "PhotoDetail",
    templateUrl: 'app/components/photos/photo.component.html',
})
export class PhotoComponent {
	photos: any = [];
	noPhotos: boolean;
	photosSet: any;
	submit: boolean = false;
	loggedOut: boolean = false;
	registered: boolean = false;
	firstname: string = '';
	lastname: string = '';

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
    	if(_params.get('submit') === 'true'){
    		this.submit = true
    	} else if (_params.get('submit') === 'out'){
    		this.loggedOut = true;
    	}
    	else if (_params.get('submit') === 'register'){
    		this.registered = true;
    		this.firstname = localStorage.getItem('first');
    		this.lastname = localStorage.getItem('last');
    	}
    	console.log(photoData.getData().length);
    	if(photoData.getData().length === 0 || this.submit){
    		this.photosSet = [];
			this._http.get('http://localhost:3000/api/photos').subscribe(data => {
				console.log(data.json());
				if(!data.json().photos){
					this.noPhotos = true;
					return true;
				}else{
					this.noPhotos = false;
					for(var i = 0; i < data.json().photos.length; i++){
						var indPhoto = {photo: '', user: ''};
						var src = 'data:image/jpeg;base64,' + data.json().photos[i][1];
						var users = data.json().photos[i][0]
						indPhoto.photo = src;
						indPhoto.user = users;
						console.log(indPhoto);
						this.photosSet.push(indPhoto);
						if(i == (data.json().photos.length - 1)){
							console.log("photoset = " + this.photosSet);
					        photoData.setData(this.photosSet);
					        this.photos = this.photosSet;
					        console.log('photos ' +  this.photos);
					        console.log(this.photos.length);
						}
					}
				}
	        })
	    }
	    else{
	    	this.photos = photoData.getData();
	    }
    }

    userLink(user){
    	this._router.parent.navigateByUrl('/' + user);
    }

}