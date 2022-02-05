import { Component } from '@angular/core';
import { BookingService } from '@app/_services';

@Component({ templateUrl: 'bookings.component.html', styleUrls: ['bookings.component.css'] })
export class BookingsComponent {
    bookings: any[] = [];

    constructor(
        private bookingService: BookingService) { }

    ngOnInit() { 
        this.bookingService.getBookings().then(data => this.bookings = data)
    }
}