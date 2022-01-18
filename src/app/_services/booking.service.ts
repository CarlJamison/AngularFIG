import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {
    constructor(private http: HttpClient) { }

    set(itinerary) {
        localStorage.setItem('currentItinerary', JSON.stringify(itinerary));
    }

    get(){
        return JSON.parse(localStorage.getItem('currentItinerary'))
    }
}