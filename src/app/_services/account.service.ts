import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
    constructor(private http: HttpClient) { }

    private profile: Observable<any>;

    ForgotPassword(email) {
        return this.http.put<any>(`${environment.apiUrl}/api/Account/ForgotPassword?email=${email}`, null);
    }

    Register(user) {
        return this.http.post<any>(`${environment.apiUrl}/api/Account/Register`, user);
    }

    Profile() {
        return this.http.get<any>(`${environment.apiUrl}/api/Account/Profile`);
    }
}
