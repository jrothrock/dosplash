import { Component } from 'angular2/core';
import { Router, ROUTER_DIRECTIVES, RouteParams }  from 'angular2/router';

@Component({
	selector: "Submit",
    templateUrl: 'app/components/submit/submit.component.html',
    directives: [ROUTER_DIRECTIVES]
})
export class SubmitComponent {
	filesToUpload: Array<File>;
     error = false;
     submit:boolean = false;
    constructor(private _router: Router, private _params: RouteParams) {
        this.filesToUpload = [];
        this.submit = !!_params.get('submit')
    }

    public getToken () {
        return localStorage.getItem('token') || '';
    }

	upload() {
        this.makeFileRequest("http://localhost:3000/api/upload", [], this.filesToUpload).then((result) => {
            console.log(result);
            if(result.success){
                this._router.parent.navigateByUrl('?submit=true');
            }
            else if(result.destroy){
                window.localStorage.clear();
                this._router.parent.navigateByUrl('?submit=out')
            }
            else{
                this._router.parent.navigateByUrl('/submit?submit=failed');
            }
        }, (error) => {
            
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
                if(!files[i].name.match(/\.(jpg|jpeg|png)$/)){
                    this.error = true;
                    reject();
                    return false;
                }
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
            xhr.setRequestHeader("Authorization", 'Bearer ' + this.getToken());
            xhr.send(formData);
        });
    }
}