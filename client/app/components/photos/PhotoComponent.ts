import { Component } from 'angular2/core';
import { RouteParams }  from 'angular2/router';
import {Http, Headers} from 'angular2/http';

//cache the photos to minimize db requests, and stop buffer overflow.
var photoData = {
    	allPhotos: [],
    	setData: function(data){
    		this.allPhotos = data;
    	},

    	getData: function(){
    		return this.allPhotos;
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


    constructor(private _http: Http, private _params: RouteParams) {
    	this.submit = !!_params.get('submit');
    	if(photoData.getData().length === 0 || this.submit){
    		this.photosSet = [];
			this._http.get('http://localhost:3000/api/photos').subscribe(data => {
				if(!data.json().photos){
					this.noPhotos = true;
					return true;
				}else{
					this.noPhotos = false;
					for(var i = 0; i < data.json().photos.length; i++){
						var src = 'data:image/jpeg;base64,' + data.json().photos[i];
						this.photosSet.push(src);
					}
				}
	        })
	        photoData.setData(this.photosSet);
	        this.photos = this.photosSet;
	    }
	    else{
	    	this.photos = photoData.getData();
	    }
    }

}