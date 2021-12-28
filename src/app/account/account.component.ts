import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'account.component.html', styleUrls: ['account.component.css']  })
export class AccountComponent implements OnInit {
    profile = null;

    constructor(
        private accountService: AccountService
    ) {}

    ngOnInit() {
        this.accountService.ProfileDetails().then(data => this.profile = data)
    }

}
