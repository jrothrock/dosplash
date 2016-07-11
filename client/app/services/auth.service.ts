import {Injectable, Inject} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromArray';
import {User} from '../models/user';

@Injectable() 
export class AuthService {
    public user:User;

    constructor(private _http: Http) {
    }

    isLoggedin = false;

    public getToken () {
        return localStorage.getItem('token') || '';
    }

    login(user) {
        var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.getToken()
        });
        var creds = "email=" + user.email + "&password=" + user.password;
        
        return new Promise((resolve, reject) => {
        
            this._http.post('http://localhost:3000/auth/login', creds, {headers: headers}).subscribe(data => {
            console.log(data.json());
            if(data.json().success){
                console.log(data.json());
                window.localStorage.setItem('user', data.json().data.user);
                window.localStorage.setItem('token', data.json().data.token);
                this.isLoggedin = true; 
                resolve(true);
            }
            else
                reject(data.json());
  
                
        })
            
        }).catch(function(e){
            console.log(e);
        });
        }
        


    register(user) {
        console.log(user);
        return new Promise((resolve, reject) => {
        var creds = "email=" + user.email + "&username=" + user.username + "&password=" + user.password;
        console.log(creds);
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this._http.post('http://localhost:3000/auth/adduser', creds, {headers: headers}).subscribe(data => {
           if(data.json().success){
               console.log(data.json());
               window.localStorage.setItem('user', data.json().data.user)
               window.localStorage.setItem('token', data.json().data.token);
               resolve(true);
           }
            else
                reject(data.json());
    
        });    
        }).catch(function(e) {
          console.log(e); // "oh, no!"
        });
        
    }
    
    logout() {
        return new Promise((resolve, reject) => {
        var creds = "email=" + localStorage.getItem('user');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Bearer ' + this.getToken());
        console.log(this.getToken());
        console.log(creds);
        console.log(headers);
        this._http.post('http://localhost:3000/auth/logout', creds, {headers: headers}).subscribe(data => {
            console.log(data);
            if(data.json().data.success){
                console.log(data.json());
                this.isLoggedin = false;
                window.localStorage.clear();
                resolve(true);
            }

            })
        })
    }



    isLoggedIn() {
        var token = localStorage.getItem('token'); 
        return (token && token.length); 
    }


}