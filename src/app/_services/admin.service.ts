﻿import { Injectable } from '@angular/core';
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

    GetBookings() {
        return this.http.get<any>(`${environment.apiUrl}/api/Admin/Bookings`).toPromise();
    }

    GetNotificationEmails() {
        return this.http.get<any>(`${environment.apiUrl}/api/Admin/Emails`).toPromise();
    }

    UpdateNotificationEmails(type, emailList){
        return this.http.post<any>(`${environment.apiUrl}/api/Admin/Emails?type=${type}`, emailList).toPromise();
    }

    SaveOrganization(org){
        return this.http.post<any>(`${environment.apiUrl}/api/Admin/Organizations`, org).toPromise();
    }

    SaveAdminOrganization(org){
        return this.http.post<any>(`${environment.apiUrl}/api/Admin/Organizations/Admin`, org).toPromise();
    }

    SendTicket(bookingId){
        return this.http.put<any>(`${environment.apiUrl}/api/Admin/SendTicket?bookingId=${bookingId}`, null).toPromise();
    }

    DeleteOrganization(orgId){
        return this.http.put<any>(`${environment.apiUrl}/api/Admin/Organizations/Delete?orgId=${orgId}`, null).toPromise();
    }

    UpdateManagers(orgId, managerList){
        return this.http.post<any>(`${environment.apiUrl}/api/Admin/Organizations/Managers?orgId=${orgId}`, managerList).toPromise();
    }

    RetrieveReport(year, month, orgId = -1) {
        return this.http.get<any>
            (`${environment.apiUrl}/api/Admin/Report?year=${year}&month=${month}&org=${orgId}`)
            .toPromise();
    }

    Ticket(bookingId){
        return this.http.put<any>(`${environment.apiUrl}/api/Admin/Ticket?bookingId=${bookingId}`, null).toPromise();
    }
    ResetTicket(bookingId){
        return this.http.put<any>(`${environment.apiUrl}/api/Admin/ResetTicket?bookingId=${bookingId}`, null).toPromise();
    }
    
}
