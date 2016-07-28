import {Injectable, Inject} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {AuthService} from '../services/auth.service';

var voteData = {
	type: null,
	setType: function(newtype){
		this.type = newtype;

	},
	getType: function(){
		return this.type;
	}
}

@Injectable() 
export class PhotoService {

	constructor(private _http: Http, private _auth: AuthService) {
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

	like(id,type){
		return new Promise((resolve, reject) => {
			var voteType = voteData.getType() !== null? voteData.getType() : type;
			console.log(voteType);
			console.log('clicked ' + id);
			var headers = new Headers({
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Authorization': 'Bearer ' + this._auth.isLoggedIn.getCookie()
	        });
	        var creds = "photo=" + id + "&type=" + voteType;
	        voteData.setType(!voteType);
	        this._http.post('http://localhost:3000/api/vote', creds, {headers: headers}).subscribe(data => {
	        	console.log(data.json());
	        	if(data.json().success){
	        		resolve(data.json());
	        	}
	        	else if(!data.json().user && data.json().destroy){
	        		voteData.setType(!voteType);
	        		window.localStorage.clear();
	        		reject(data.json());
	        	}
	        })
		})
		.catch(function(e){
        	console.log(e);
        });
	}
}