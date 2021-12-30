import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
    constructor(private http: HttpClient) { }

    private profile: Observable<any>;

    ConfirmAccount(email) {
        return this.http.put<any>(`${environment.apiUrl}/api/Admin/ConfirmAccount?email=${email}`, null).toPromise();
    }

    ForgotPassword(email) {
        return this.http.put<any>(`${environment.apiUrl}/api/Account/ForgotPassword?email=${email}`, null);
    }

    ChangePassword(change) {
        return this.http.post<any>(`${environment.apiUrl}/api/Account/ChangePassword`, change).toPromise();
    }

    Register(user) {
        return this.http.post<any>(`${environment.apiUrl}/api/Account/Register`, user);
    }

    Profile() {
        return this.http.get<any>(`${environment.apiUrl}/api/Account/Profile`);
    }

    ProfileDetails() {
        return this.http.get<any>(`${environment.apiUrl}/api/Account/ProfileDetails`).toPromise();
    }

    Organization() {
        return this.http.get<any>(`${environment.apiUrl}/api/Account/Organization`).toPromise();
    }

    SaveOrganization(org) {
        return this.http.post<any>(`${environment.apiUrl}/api/Account/Organization`, org).toPromise();
    }

    SaveProfileDetails(profile) {
        return this.http.post<any>(`${environment.apiUrl}/api/Account/ProfileDetails`, profile).toPromise();
    }
}
