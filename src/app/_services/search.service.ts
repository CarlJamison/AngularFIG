import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchService {
    constructor(private http: HttpClient) { }

    Search(search) {
        return this.http.post<any>(`${environment.apiUrl}/api/Search`, search).toPromise();
    }

    Request(search) {
        return this.http.post<any>(`${environment.apiUrl}/api/Group/Request`, search).toPromise();
    }
}
