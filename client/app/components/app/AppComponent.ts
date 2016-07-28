import { Component, OnInit } from 'angular2/core';
import { HTTP_PROVIDERS } from 'angular2/http';
import 'rxjs/Rx';   // Load all features
import { Router, ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES, CanActivate, Location } from 'angular2/router';
import {AuthService} from '../../services/auth.service';

import { FeaturedComponent } from '../home/featured/FeaturedComponent';
import { SignInComponent } from '../auth/signIn/SignInComponent';
import { PhotoComponent } from '../photos/PhotoComponent';
import { SignUpComponent } from '../auth/signUp/SignUpComponent';
import { SubmitComponent } from '../submit/SubmitComponent';
import { ProfileComponent } from '../profiles/profile/ProfileComponent';
import { ProfileFormComponent } from '../profiles/profileForm/ProfileFormComponent';
import { NewComponent } from '../home/new/NewComponent';
import { DummyComponent } from '../dummy/DummyComponent';

@Component({
    selector: 'my-app',
    templateUrl: 'app/components/app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [HTTP_PROVIDERS,
                ROUTER_PROVIDERS,
                AuthService]
})

@RouteConfig([
    { path: '/', name: 'Home', component: FeaturedComponent, useAsDefault: true },
    { path: '/new', name: 'New', component: NewComponent },
    { path: '/signin', name: 'SignIn', component: SignInComponent},
    { path: '/signup', name: 'SignUp', component: SignUpComponent},
    { path: '/submit', name: 'Submit', component: SubmitComponent},
    { path: '/...', name: 'Profile', component: ProfileComponent},
    { path: '/:id/form', name: 'ProfileForm', component: ProfileFormComponent},
    { path: '/a', name: 'DummyRoute', component: DummyComponent},
    { path: '/**', redirectTo: ['Home'] }
])


export class AppComponent {
    navUsername: string = '';
    newString:string = 'new';
    isLoggedIn = this._auth.isLoggedIn.check;
    
    constructor (private _router: Router, public _auth: AuthService, private _location: Location) {
    }

    ngOnInit(){
        this.navUsername =  localStorage.getItem('user');
    }

    currentUser(){
        if(this.navUsername === this._location.path().split('/').slice(1)[0]){
            return true;
        }
        return false;
    }
    logout() {
        this._auth.logout()
            .then(() => { 
                    this._router.navigateByUrl('/?message=logout');
                }
            );
    }

    profile(){
        this.navUsername = localStorage.getItem('user');
        console.log(this.navUsername);
        window.localStorage.setItem('reRoute', this.navUsername);
        this._router.navigateByUrl('/a?route=profile');
    }
}