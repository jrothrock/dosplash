import {Injectable, Inject} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromArray';
import {User} from '../models/user';

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

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
                window.localStorage.setItem('email', data.json().data.email);
                window.localStorage.setItem('first', data.json().data.first);
                window.localStorage.setItem('last', data.json().data.last);
                setCookie('_dosplash_session', data.json().data.token, 3);
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
        var creds = "firstname=" + user.firstname + "&lastname=" + user.lastname + "&email=" + user.email + "&username=" + user.username + "&password=" + user.password;
        console.log(creds);
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this._http.post('http://localhost:3000/auth/adduser', creds, {headers: headers}).subscribe(data => {
           if(data.json().success){
               console.log(data.json());
               window.localStorage.setItem('user', data.json().data.user);
               window.localStorage.setItem('email', data.json().data.email);
               window.localStorage.setItem('first', data.json().data.first);
               window.localStorage.setItem('last', data.json().data.last);
               setCookie('_dosplash_session', data.json().data.token, 3);
               resolve(true);
           }
            else
                reject(data.json());
    
        });    
        }).catch(function(e) {
          console.log(e); 
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
                    var cookies = document.cookie.split(";");
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i];
                        var eqPos = cookie.indexOf("=");
                        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }
                    resolve(true);
                }

            })
        })
    }



    isLoggedIn = {
        check: function(){
            var cookies = document.cookie.split(';'); 
            for(var i = 0; i < cookies.length; i++){
                if(cookies[i].indexOf('_dosplash_session') === 0 ){
                    return true;
                }
            }
            return false;
       },
       getCookie: function(){
           var cookies = document.cookie.split(';'); 
           for(var i = 0; i < cookies.length; i++){
                if(cookies[i].indexOf('_dosplash_session') === 0 ){
                    console.log(cookies[i].substring('_dosplash_session='.length, cookies[i].length));
                    return cookies[i].substring('_dosplash_session='.length, cookies[i].length);
                }
           }
           return '';
        }
    }


}