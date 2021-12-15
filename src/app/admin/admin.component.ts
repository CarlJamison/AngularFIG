import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService, UserService, AdminService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({ templateUrl: 'admin.component.html', styleUrls: ['admin.component.css'] })
export class AdminComponent implements OnInit {
    loading = false;
    users: any[];
    unconfirmed: any[];
    tab = 0;
    pricingForm: FormGroup;
    orgs: any[] = [{ Name: "Training Leaders International"}, { Name: "Raining Leaders"}, { Name: "Eaters International"}]
    currentOrg: ""

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private adminService: AdminService,
        private accountService: AccountService) { }

    ngOnInit() {
        this.adminService.GetPricing().then(data => {
            this.f.published.setValue(data.Published);
            this.f.consolidated.setValue(data.Consolidated);
            this.f.humanitarian.setValue(data.Humanitarian);
        });

        this.pricingForm = this.formBuilder.group({
            published: ['', Validators.required],
            consolidated: ['', Validators.required],
            humanitarian: ['', Validators.required]
        });

        this.getUsers();
    }
    
    get f() { return this.pricingForm.controls; }

    onSubmit(){
        if(!this.loading){
            this.loading = true;
            this.adminService.SavePricing({
                Published: this.f.published.value,
                Consolidated: this.f.consolidated.value,
                Humanitarian: this.f.humanitarian.value
            }).then(() => this.loading = false);
        }
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
