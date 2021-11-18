import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, UserService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({ templateUrl: 'admin.component.html', styleUrls: ['admin.component.css'] })
export class AdminComponent implements OnInit {
    loading = false;
    users: any[];
    unconfirmed: any[];
    tab = 0;
    pricingForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private accountService: AccountService) { }

    ngOnInit() {
        this.pricingForm = this.formBuilder.group({
            published: ['', Validators.required],
            consolidated: ['', Validators.required],
            humanitarian: ['', Validators.required]
        });

        this.getUsers();
    }

    onSubmit(){
        console.log("Saved")
    }

    getUsers(){
        this.loading = true;
        return this.userService.getAll().toPromise().then(users => {
            this.loading = false;
            this.users = users;
            this.unconfirmed = this.users.filter(u => !u.IsConfirmed);
        });
    }

    confirmAccount(user){
        user.loading = true;
        this.accountService.ConfirmAccount(user.Email).then(() => this.getUsers().then(() => user.loading = false));
    }
}
