import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
    constructor(private http: HttpClient) { }

    SavePricing(pricing) {
        return this.http.post<any>(`${environment.apiUrl}/api/Admin/Pricing`, pricing).toPromise();
    }

    GetPricing() {
        return this.http.get<any>(`${environment.apiUrl}/api/Admin/Pricing`).toPromise();
    }

    GetOrganizations() {
        return this.http.get<any>(`${environment.apiUrl}/api/Admin/Organizations`).toPromise();
    }

    SaveOrganization(org){
        return this.http.post<any>(`${environment.apiUrl}/api/Admin/Organizations`, org).toPromise();
    }
}
