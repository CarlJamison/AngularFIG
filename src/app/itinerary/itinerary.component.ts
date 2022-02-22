import { Component } from '@angular/core';
import { AirportService, BookingService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({ templateUrl: 'itinerary.component.html', styleUrls: ['itinerary.component.css'] })
export class ItineraryComponent {
    pLoading = false;
    cLoading = false;
    itinerary;
    error;

    constructor(
        private airportService: AirportService,
        private route: ActivatedRoute,
        private bookingService: BookingService,
        private router: Router) { 
            route.queryParams.pipe(map(p => p.id)).subscribe(id => this.getItinerary(id));
    }

    getItinerary(id: number){
        this.bookingService.getItinerary(id).then(data => {
            this.itinerary = data;
            this.itinerary.DateReserved = this.dateString(this.itinerary.DateReserved);
            this.itinerary.DepartureDate = this.dateString(this.itinerary.DepartureDate);
            this.itinerary.ReturnDate = this.dateString(this.itinerary.ReturnDate);
        }).catch(error => this.error = error);
    }

    dateString(date: string){
        return (new Date(date)).toLocaleDateString();
    }

    get cancelled() { return this.itinerary.BookingStatus == 1 || this.itinerary.Status == "cancelled"}

    cancel(){
        this.cLoading = true;
        this.bookingService.cancel(this.itinerary.RecordLocater, !this.cancelled)
            .then(() => this.router.navigate(['bookings']))
            .catch(error => {
                this.error = error;
                this.cLoading = false;
            });
    }

    purchase(){
        this.pLoading = true;
        this.bookingService.purchase(this.itinerary.RecordLocater)
            .then(() => this.getItinerary(this.itinerary.Id))
            .catch(error => {
                this.error = error;
                this.pLoading = false;
            })
    }
}