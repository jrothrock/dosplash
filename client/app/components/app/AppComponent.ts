import { Component } from 'angular2/core';
import { HTTP_PROVIDERS } from 'angular2/http';
import 'rxjs/Rx';   // Load all features
import { ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { HomeComponent } from '../home/HomeComponent';
import { SignInComponent } from '../signIn/SignInComponent';
import { PhotoComponent } from '../photos/PhotoComponent';

@Component({
    selector: 'my-app',
    templateUrl: 'app/components/app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [HTTP_PROVIDERS,
                ROUTER_PROVIDERS]
})

@RouteConfig([
    { path: '/', name: 'Home', component: HomeComponent, useAsDefault: true },
    { path: 'signin', name: 'SignIn', component: SignInComponent},
    { path: 'photos:/id', name: 'PhotoDetail', component: PhotoComponent}
])

export class AppComponent {
    pageTitle: string = 'dosplash';
}