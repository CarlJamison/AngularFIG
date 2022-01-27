import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';

import { BasicAuthInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { BookComponent } from './book'
import { AddEditOrganizationDialog, AddRemoveManagerDialog, AdminComponent, TransferUserDialog } from './admin';
import { ForgotAccountComponent } from './forgot-account';
import { CreateAccountComponent } from './create-account';
import { AccountComponent, ChangePasswordDialog, EditProfileDialog } from './account';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { BookingsComponent } from './bookings';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatNativeDateModule,
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatButtonModule,
        LoadingBarRouterModule,
        LoadingBarHttpClientModule,
        MatIconModule,
        MatDialogModule,
        ClipboardModule,
        MatRadioModule,
        MatSelectModule,
        MatDividerModule,
        MatSliderModule,
        CreditCardDirectivesModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        AdminComponent,
        BookComponent,
        BookingsComponent,
        ForgotAccountComponent,
        CreateAccountComponent,
        AccountComponent,
        AddEditOrganizationDialog,
        EditProfileDialog,
        ChangePasswordDialog,
        AddRemoveManagerDialog,
        TransferUserDialog
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }