import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService, AuthenticationService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: User;
    profile: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private accountService: AccountService,
    ) {
        this.authenticationService.currentUser.subscribe(u => {
            this.currentUser = u;
            if(u) this.accountService.Profile().subscribe(p => this.profile = p);
        });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}