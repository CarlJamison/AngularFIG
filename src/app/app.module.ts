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
import { AddEditOrganizationDialog, AddRemoveManagerDialog, AdminComponent, TransferUserDialog, AddRemoveEmailDialog } from './admin';
import { ForgotAccountComponent } from './forgot-account';
import { CreateAccountComponent } from './create-account';
import { AccountComponent, ChangePasswordDialog, EditProfileDialog } from './account';

import { MatDatepickerModule } from '@angular/material/datepicker';
iimport { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MMatLegacyFormFieldModule as MatFormFieldModule} from '@@angular/material/legacy-form-field;
import { MMatLegacyInputModule as MatInputModule} from '@@angular/material/legacy-input;
import { MMatLegacyAutocompleteModule as MatAutocompleteModule from '@@angular/material/legacy-autocomplete;
import { MMatLegacyButtonModule as MatButtonModule} from '@@angular/material/legacy-button;
import { MMatLegacyDialogModule as MatDialogModule} from '@@angular/material/legacy-dialog;
import { MMatLegacyCheckboxModule as MatCheckboxModule} from '@@angular/material/legacy-checkbox;
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { MatIconModule } from '@angular/material/icon';
import { MMatLegacyRadioModule as MatRadioModule} from '@@angular/material/legacy-radio;
import { MMatLegacySelectModule as MatSelectModule} from '@@angular/material/legacy-select;
import { MatDividerModule } from '@angular/material/divider';
import { MMatLegacySliderModule as MatSliderModule} from '@@angular/material/legacy-slider;
import { MMatLegacyTabsModule as MatTabsModule} from '@@angular/material/legacy-tabs;
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MMatLegacySnackBarModule as MatSnackBarModule} from '@@angular/material/legacy-snack-bar;
//import { CreditCardDirectivesModule } from 'angular-cc-library';
import { BookingsComponent } from './bookings';
import { ItineraryComponent } from './itinerary';
import { FeedbackComponent } from './feedback';
import { GroupRequestComponent } from './group-request';

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
        //CreditCardDirectivesModule,
        MatTabsModule,
        MatSnackBarModule
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
        TransferUserDialog,
        AddRemoveEmailDialog,
        ItineraryComponent,
        FeedbackComponent,
        GroupRequestComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }