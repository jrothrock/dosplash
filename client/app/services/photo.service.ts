import {Injectable, Inject} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

@Injectable() 
export class AuthService {
	constructor(private _http: Http) {
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
}