import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {
    constructor(private http: HttpClient) { }

    private itinerary = null;
    private confirmation = null;

    set(itinerary) {
        this.itinerary = itinerary;
        localStorage.setItem('currentItinerary', JSON.stringify(itinerary));
    }

    get(){
        if(!this.itinerary){
            this.itinerary = JSON.parse(localStorage.getItem('currentItinerary'));
        }
        return this.itinerary;
    }

    confirm(){
        return this.http.post<any>(`${environment.apiUrl}/api/Search/Confirm`, this.get()).toPromise().then(data => {
            this.confirmation = data;
            localStorage.setItem('currentItineraryConfirmation', JSON.stringify(this.confirmation));
            this.set(data.itinerary)
            return true;
        });
    }

    book(passengers){
        return this.http.post<any>(`${environment.apiUrl}/api/Search/Book`, passengers).toPromise();
    }

    getConfirmation(){
        if(!this.confirmation){
            this.confirmation = JSON.parse(localStorage.getItem('currentItineraryConfirmation'));
        }
        return this.confirmation;
    }
}