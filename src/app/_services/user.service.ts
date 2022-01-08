import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/Admin/Users`);
    }

    GetUnconfirmed() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/Admin/UnconfirmedUsers`);
    }

    search(firstName, lastName, orgId = -1) {
        return this.http.get<User[]>
            (`${environment.apiUrl}/api/Admin/Users/Search?FirstName=${firstName}&LastName=${lastName}&OrgId=${orgId}`)
            .toPromise();
    }

    TransferUser(userId, orgId){
        return this.http.put<any>(`${environment.apiUrl}/api/Admin/Users/Transfer?UserId=${userId}&OrgId=${orgId}`, null).toPromise();
    }
}