import { Component, OnInit } from 'angular2/core';
import { HTTP_PROVIDERS } from 'angular2/http';
import 'rxjs/Rx';   // Load all features
import { Router, ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES, CanActivate } from 'angular2/router';
import {AuthService} from '../../services/auth.service';

import { FeaturedComponent } from '../home/featured/FeaturedComponent';
import { SignInComponent } from '../auth/signIn/SignInComponent';
import { PhotoComponent } from '../photos/PhotoComponent';
import { SignUpComponent } from '../auth/signUp/SignUpComponent';
import { SubmitComponent } from '../submit/SubmitComponent';
import { ProfileComponent } from '../profiles/profile/ProfileComponent';
import { ProfileFormComponent } from '../profiles/profileForm/ProfileFormComponent';
import { NewComponent } from '../home/new/NewComponent';

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
    { path: '/**', redirectTo: ['Home'] }
])


export class AppComponent {
    navUsername: string = '';
    newString:string = 'new';
    isLoggedIn = this._auth.isLoggedIn;

    constructor (private _router: Router, public _auth: AuthService) {
    }

    ngOnInit(){
        this.navUsername =  localStorage.getItem('user');
    }


    logout() {
        this._auth.logout()
            .then(() => { 
                    this._router.navigateByUrl('/?message=logout');
                }
            );
    }

    profile(){
        console.log(this.navUsername);
        this._router.navigate(['Profile', 'Profile', {id:this.navUsername}]);
    }
}