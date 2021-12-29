import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'account.component.html', styleUrls: ['account.component.css']  })
export class AccountComponent implements OnInit {
    profile = null;

    constructor(
        public dialog: MatDialog,
        private accountService: AccountService
    ) {}

    ngOnInit() {
        this.accountService.ProfileDetails().then(data => this.profile = data)
    }

    changePassword(){
        this.dialog.open(ChangePasswordDialog, {
            width: '600px',
          });
    }

    editProfile(){
        var dialogRef = this.dialog.open(EditProfileDialog, {
            data: this.profile,
            width: '600px',
          });
  
          dialogRef.afterClosed().subscribe(data => this.profile = data ? data : this.profile);
    }

}

@Component({ templateUrl: 'edit-profile-dialog.html', styleUrls: [] })
export class EditProfileDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<EditProfileDialog>,
        private accountService: AccountService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder) {}

    loading=false
    submitted=false
    profileForm: FormGroup;

    ngOnInit() {
        this.profileForm = this.formBuilder.group({
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            PhoneNumber: ['', Validators.required]
        });

        this.f.FirstName.setValue(this.data.FirstName);
        this.f.LastName.setValue(this.data.LastName);
        this.f.PhoneNumber.setValue(this.data.PhoneNumber);
    }

    get f() { return this.profileForm.controls; }

    onSubmit(){
        this.submitted = true;
        if (this.profileForm.invalid || this.loading) {
            return;
        }

        this.loading = true;
        this.accountService.SaveProfileDetails({
            FirstName : this.f.FirstName.value,
            LastName: this.f.LastName.value,
            PhoneNumber: this.f.PhoneNumber.value
        }).then(data => this.dialogRef.close(data));
    }
}

@Component({ templateUrl: 'change-password-dialog.html', styleUrls: [] })
export class ChangePasswordDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<EditProfileDialog>,
        private accountService: AccountService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder) {}

    loading=false;
    submitted=false;
    success=false;
    error='';
    passwordForm: FormGroup;

    ngOnInit() {
        this.passwordForm = this.formBuilder.group({
            CurrentPassword: ['', Validators.required],
            NewPassword: ['', Validators.required],
            ConfirmNewPassword: ['', Validators.required]
        });
    }

    get f() { return this.passwordForm.controls; }

    onSubmit(){
        if(this.success){
            this.dialogRef.close();
            return;
        }

        this.submitted = true;
        if (this.passwordForm.invalid || this.loading) {
            return;
        }

        this.loading = true;
        this.accountService.ChangePassword({
            OldPassword : this.f.CurrentPassword.value,
            NewPassword: this.f.NewPassword.value,
            ConfirmPassword: this.f.ConfirmNewPassword.value
        }).then(() => {
            this.success = true;
            this.loading = false;
        }).catch(error => {
            this.error = error;
            this.loading = false;
        });
    }
}
