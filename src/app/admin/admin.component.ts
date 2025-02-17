﻿import { Component, Inject, OnInit } from '@angular/core';
import { AccountService, UserService, AdminService } from '@app/_services';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({ templateUrl: 'admin.component.html', styleUrls: ['admin.component.css'] })
export class AdminComponent implements OnInit {
    loading = false;
    users: any[];
    report; any = null;
    unconfirmed: any[];
    tab = 0;
    bTab = 0;
    pricingForm: UntypedFormGroup;
    searchForm: UntypedFormGroup;
    reportForm: UntypedFormGroup;
    orgs: any[] = [];
    bookings: any[] = [];
    emails: any[] = [];
    currentOrg: "";
    notificationTypes = [
        {Name: 'Purchase Notifications', Value: 0},
        {Name: 'Registration Notifications', Value: 1},
        {Name: 'Feedback Notifications', Value: 2},
        {Name: 'Group Request Notifications', Value: 3}
    ]

    constructor(
        public dialog: MatDialog,
        private formBuilder: UntypedFormBuilder,
        private userService: UserService,
        private adminService: AdminService,
        private accountService: AccountService) { }

    ngOnInit() {
        this.adminService.GetPricing().then(data => {
            this.f.published.setValue(data.Published);
            this.f.consolidated.setValue(data.Consolidated);
            this.f.humanitarian.setValue(data.Humanitarian);
        });

        this.adminService.GetOrganizations().then(data => this.orgs = data );

        this.adminService.GetBookings().then(data => this.processBookings(data));

        this.adminService.GetNotificationEmails().then(data => this.emails = data );

        this.pricingForm = this.formBuilder.group({
            published: ['', Validators.required],
            consolidated: ['', Validators.required],
            humanitarian: ['', Validators.required]
        });

        this.searchForm = this.formBuilder.group({
            FirstName: [''],
            LastName: [''],
            orgSearch: ['']
        });

        this.reportForm = this.formBuilder.group({
            Year: ['', Validators.required],
            Month: [''],
            org: ['']
        });

        this.r.Year.setValue(new Date().getFullYear());
        this.r.Month.setValue(-1);
        this.r.org.setValue(-1);

        this.GetUnconfirmed();
    }

    processBookings(data){
        data.forEach(b => {
            b.DepartureDate = this.dateString(b.DepartureDate);
            b.BookingDate = this.dateString(b.BookingDate);
        })
        
        this.bookings[0] = data.filter(b => b.RecordStatus == 'reserved');
        this.bookings[1] = data.filter(b => b.Status == 0 && b.RecordStatus == 'guaranteed');
        this.bookings[2] = data.filter(b => b.RecordStatus == 'ticketed');
    }

    dateString(date: string){
        return (new Date(date)).toLocaleDateString();
    }

    getBookings(){
        return this.bookings[this.bTab];
    }

    ticket(booking){
        this.adminService.SendTicket(booking.Id).then(() => {
            if(booking.Status == 0){
                this.adminService.Ticket(booking.Id).then(data => this.processBookings(data));
            }
        });
    }

    getEmails(type){
        return this.emails
            .filter(e => e.Type == type)
            .map(e => e.Email);
    }
    
    get r() { return this.reportForm.controls; }
    get f() { return this.pricingForm.controls; }
    get s() { return this.searchForm.controls; }

    search(){
        this.loading = true;
        var orgId = this.s.orgSearch.value
        return this.userService.search(this.s.FirstName.value, this.s.LastName.value, orgId ? orgId : -1).then(users => {
            this.loading = false;
            this.users = users;
        });
    }

    getReport(){
        this.loading = true;
        var orgId = this.r.org.value
        return this.adminService.RetrieveReport(this.r.Year.value, this.r.Month.value, orgId ? orgId : -1).then(report => {
            this.loading = false;
            report.Total = report.Total.toFixed(2);
            report.ContractMarkup = report.ContractMarkup.toFixed(2);
            report.AdditionalMarkup = report.AdditionalMarkup.toFixed(2);
            this.report = report;
        });
    }

    getOrgName(id){
        var org = this.orgs.find(o => o.Id == id);
        return org ? org.Name : '(Unassigned)';
    }

    transfer(user){
        var dialogRef = this.dialog.open(TransferUserDialog, {
            data: { orgs: this.orgs, user }
          });
  
          dialogRef.afterClosed().subscribe(data => user.OrgId = data ? data : user.OrgId);
    }

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

    GetUnconfirmed(){
        return this.userService.GetUnconfirmed().toPromise().then(users => this.unconfirmed = users);
    }

    getLink(org){
        return `${window.location.host}/register?Code=${org.ShareableSuffix}`
    }

    confirmAccount(user){
        user.loading = true;
        this.accountService.ConfirmAccount(user.Email).then(() => this.GetUnconfirmed().then(() => user.loading = false));
    }

    editOrganization(org = null) {
        org.isAdmin = true;
        var dialogRef = this.dialog.open(AddEditOrganizationDialog, {
          data: org,
          width: '600px',
        });

        dialogRef.afterClosed().subscribe(data => this.orgs = data ? data : this.orgs);
    }

    editManagers(org) {
        var dialogRef = this.dialog.open(AddRemoveManagerDialog, {
          data: org,
          width: '650px',
        });

        dialogRef.afterClosed().subscribe(data => this.orgs = data ? data : this.orgs);
    }

    editEmails(type) {
        var dialogRef = this.dialog.open(AddRemoveEmailDialog, {
          data: {
              emails: this.getEmails(type),
              type: type
          },
          width: '650px',
        });

        dialogRef.afterClosed().subscribe(data => this.emails = data ? data : this.emails);
    }

    saveOrganization(org){
        var saveData = {
            Id: org.Id,
            HasCON: org.HasCON,
            HasPUB: org.HasPUB,
            HasMIS: org.HasMIS,
            AdditionalMarkUp: org.AdditionalMarkUp
        }

        this.adminService.SaveAdminOrganization(saveData).then(data => this.orgs = data);
    }

    deleteOrganization(org){
        if(confirm("Are you sure to delete " + org.Name)) {
            this.adminService.DeleteOrganization(org.Id).then(data => this.orgs = data);
        }
    }
}

@Component({ templateUrl: 'add-edit-organization-dialog.html', styleUrls: [] })
export class AddEditOrganizationDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<AddEditOrganizationDialog>,
        private adminService: AdminService,
        private accountService: AccountService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: UntypedFormBuilder) {}

    loading=false
    submitted=false
    orgForm: UntypedFormGroup;

    ngOnInit() {
        this.orgForm = this.formBuilder.group({
            Name: ['', Validators.required],
            Address: ['', Validators.required],
            City: ['', Validators.required],
            State: ['', Validators.required],
            Zipcode: ['', Validators.required],
            PhoneNumber: ['', Validators.required],
            ContactFirstName: ['', Validators.required],
            ContactLastName: ['', Validators.required],
            ContactEmail: ['', Validators.required],
            ContactPhoneNumber: ['', Validators.required],
            DefaultAirport: ['']
        });

        if(this.data){
            this.f.Name.setValue(this.data.Name);
            this.f.Address.setValue(this.data.Address);
            this.f.City.setValue(this.data.City);
            this.f.State.setValue(this.data.State);
            this.f.Zipcode.setValue(this.data.ZipCode);
            this.f.PhoneNumber.setValue(this.data.PhoneNumber);
            this.f.ContactFirstName.setValue(this.data.ContactFirstName);
            this.f.ContactLastName.setValue(this.data.ContactLastName);
            this.f.ContactEmail.setValue(this.data.ContactEmail);
            this.f.ContactPhoneNumber.setValue(this.data.ContactPhoneNumber);
            this.f.DefaultAirport.setValue(this.data.DefaultAirport);
        }
    }

    get f() { return this.orgForm.controls; }

    onSubmit(){
        this.submitted = true;
        if (this.orgForm.invalid || this.loading) {
            return;
        }

        this.loading = true;

        var saveModel = {
            Id : this.data ? this.data.Id : 0,
            Name: this.f.Name.value,
            Address: this.f.Address.value,
            City: this.f.City.value,
            State: this.f.State.value,
            Zipcode: this.f.Zipcode.value,
            PhoneNumber: this.f.PhoneNumber.value,
            ContactFirstName: this.f.ContactFirstName.value,
            ContactLastName: this.f.ContactLastName.value,
            ContactPhoneNumber: this.f.ContactPhoneNumber.value,
            ContactEmail: this.f.ContactEmail.value,
            DefaultAirport: this.f.DefaultAirport.value
        }

        if(this.data.isAdmin){
            this.adminService.SaveOrganization(saveModel)
                .then(data => this.dialogRef.close(data));
        }else{
            this.accountService.SaveOrganization(saveModel)
                .then(data => this.dialogRef.close(data));
        }
    }
}

@Component({ templateUrl: 'add-remove-managers-dialog.html', styleUrls: ['admin.component.css'] })
export class AddRemoveManagerDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<AddEditOrganizationDialog>,
        private adminService: AdminService,
        private userService: UserService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: UntypedFormBuilder) {}

    loading=false
    submitted=false
    form: UntypedFormGroup;
    searchResults: any[];
    managers:any[] = [];

    users(){ 
        return this.searchResults.filter(u => !this.managers.some(m => m.Id == u.Id));
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            FirstName: [''],
            LastName: ['']
        });

        this.managers = this.data.Managers
    }

    add(user){
        this.managers.push(user)
    }

    remove(user){
        this.managers = this.managers.filter(m => m.Id != user.Id);
    }

    get f() { return this.form.controls; }

    search(){
        if (this.loading) return;
        if (!this.f.FirstName.value.length && !this.f.LastName.value.length) return;

        this.userService.search(this.f.FirstName.value, this.f.LastName.value).then((data: any[]) => {
            this.searchResults = data;
            this.loading = false;
        })
    }

    save(){
        if (this.loading) return;
        this.loading = true;
        
        this.adminService.UpdateManagers(this.data.Id, this.managers.map(m => m.Id))
            .then(data => this.dialogRef.close(data));
    }
}
@Component({ templateUrl: 'transfer-user-dialog.html', styleUrls: ['admin.component.css'] })
export class TransferUserDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<AddEditOrganizationDialog>,
        private userService: UserService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: UntypedFormBuilder) {}

    loading=false
    form: UntypedFormGroup;
    orgs;
    user;

    ngOnInit() {
        this.form = this.formBuilder.group({
            transferOrg: ['', Validators.required]
        });

        this.orgs = this.data.orgs;
        this.user = this.data.user;
    }

    getOrgName(){
        var org = this.orgs.find(o => o.Id == this.user.OrgId);
        return org ? org.Name : '(Unassigned)';
    }

    get f() { return this.form.controls; }

    save(){
        if (this.loading || this.form.invalid) return;
        this.loading = true;
        
        this.userService.TransferUser(this.user.Id, this.f.transferOrg.value)
            .then(() => this.dialogRef.close(this.f.transferOrg.value));
    }
}
@Component({ templateUrl: 'add-remove-email.html', styleUrls: ['admin.component.css'] })
export class AddRemoveEmailDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<AddRemoveEmailDialog>,
        private adminService: AdminService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: UntypedFormBuilder) {}

    loading = false
    form: UntypedFormGroup;
    emails: any[] = [];

    add(){
        if (this.form.invalid) return;

        this.emails.push(this.f.Email.value);
    }

    remove(email){
        this.emails = this.emails.filter(e => e != email);
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            Email: ['', Validators.required]
        });

        this.emails = this.data.emails;
    }

    get f() { return this.form.controls; }

    save(){
        if (this.loading) return;
        this.loading = true;
        
        this.adminService.UpdateNotificationEmails(this.data.type, this.emails)
            .then(data => this.dialogRef.close(data));
    }
}
