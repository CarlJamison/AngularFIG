import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map } from 'rxjs/operators';

import { AccountService, AuthenticationService } from '@app/_services';

@Component({ templateUrl: 'create-account.component.html' })
export class CreateAccountComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    success = false;
    returnUrl: string;
    error = '';
    shareableCode = null;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private accountService: AccountService,
        private route: ActivatedRoute
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }

        route.queryParams.pipe(map(p => p.Code)).subscribe(c => this.shareableCode = c);
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            confirm_password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.Register({
            Email: this.f.username.value, 
            FirstName: this.f.firstName.value, 
            LastName: this.f.lastName.value, 
            PhoneNumber: this.f.phoneNumber.value, 
            Password: this.f.password.value, 
            OrgCode: this.shareableCode,
            ConfirmPassword: this.f.confirm_password.value})
            .pipe(first())
            .subscribe(
                data => {
                    this.success = true;
                    this.loading = false;
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}
