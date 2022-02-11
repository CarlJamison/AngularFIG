import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '@app/_services';

@Component({ templateUrl: 'bookings.component.html', styleUrls: ['bookings.component.css'] })
export class BookingsComponent {
    bookings: any[] = [];

    constructor(
        private router: Router,
        private bookingService: BookingService) { }

    ngOnInit() { 
        this.bookingService.getBookings().then(data => this.bookings = data)
    }

    goToItinerary(itin){
        this.router.navigate(['itinerary'], { queryParams: { id: itin.Id } });
    }
}