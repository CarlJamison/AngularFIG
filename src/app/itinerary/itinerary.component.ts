import { Component } from '@angular/core';
import { AirportService, BookingService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({ templateUrl: 'itinerary.component.html', styleUrls: ['itinerary.component.css'] })
export class ItineraryComponent {
    loading = false;
    itinerary;
    error;

    constructor(
        private airportService: AirportService,
        private route: ActivatedRoute,
        private bookingService: BookingService,
        private router: Router) { 
            route.queryParams.pipe(map(p => p.id)).subscribe(id => this.bookingService.getItinerary(id).then(data => {
                this.itinerary = data;
                this.itinerary.DateReserved = this.dateString(this.itinerary.DateReserved);
                this.itinerary.DepartureDate = this.dateString(this.itinerary.DepartureDate);
                this.itinerary.ReturnDate = this.dateString(this.itinerary.ReturnDate);
                //this.itinerary.Airline = airportService.Airlines().find(a => a.value == this.itinerary.Airline).Name;
            }).catch(error => this.error = error));
    }

    dateString(date: string){
        return (new Date(date)).toLocaleDateString();
    }
    
    ngOnInit(){
        
    }
}