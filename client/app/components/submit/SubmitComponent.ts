import { Component } from 'angular2/core';
import { Router, ROUTER_DIRECTIVES }  from 'angular2/router';

@Component({
	selector: "Submit",
    templateUrl: 'app/components/submit/submit.component.html',
    directives: [ROUTER_DIRECTIVES]
})
export class SubmitComponent {
	filesToUpload: Array<File>;
 
    constructor(private _router: Router) {
        this.filesToUpload = [];
    }

	upload() {
        this.makeFileRequest("http://localhost:3000/api/upload", [], this.filesToUpload).then((result) => {
        	this._router.navigate(['Home']);
            console.log(result);
        }, (error) => {
            console.error(error);
        });
    }
 
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>> fileInput.target.files;
    }
 
    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();
            for(var i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", url, true);
            xhr.send(formData);
        });
    }
}