import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'forgot-account.component.html' })
export class ForgotAccountComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    success = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private accountService: AccountService
    ) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
        this.accountService.ForgotPassword(this.f.email.value)
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
