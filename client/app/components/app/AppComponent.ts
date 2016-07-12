import { Component } from 'angular2/core';
import { HTTP_PROVIDERS } from 'angular2/http';
import 'rxjs/Rx';   // Load all features
import { Router, ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES, CanActivate } from 'angular2/router';
import {AuthService} from '../../services/auth.service';

import { HomeComponent } from '../home/HomeComponent';
import { SignInComponent } from '../auth/signIn/SignInComponent';
import { PhotoComponent } from '../photos/PhotoComponent';
import { SignUpComponent } from '../auth/signUp/SignUpComponent';
import { SubmitComponent } from '../submit/SubmitComponent';

@Component({
    selector: 'my-app',
    templateUrl: 'app/components/app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [HTTP_PROVIDERS,
                ROUTER_PROVIDERS,
                AuthService]
})

@RouteConfig([
    { path: '/', name: 'Home', component: HomeComponent, useAsDefault: true },
    { path: '/signin', name: 'SignIn', component: SignInComponent},
    { path: '/signup', name: 'SignUp', component: SignUpComponent},
    { path: '/photos/:id', name: 'PhotoDetail', component: PhotoComponent},
    { path: '/submit', name: 'Submit', component: SubmitComponent},
    { path: '/**', redirectTo: ['Home'] }
])


export class AppComponent {
    constructor (private router: Router, public _auth: AuthService) {
    }

    isLoggedIn = this._auth.isLoggedIn;

    logout = function () {
        this._auth.logout()
            .then(() => { 
                    this.router.navigate(['Home']);
                }
            );
    }
}