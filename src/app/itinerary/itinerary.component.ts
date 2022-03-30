import { Component } from '@angular/core';
import { AirportService, BookingService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
            this.itinerary.Name = this.itinerary.Name.split(": ")[0];
            this.itinerary.DateReserved = this.dateString(this.itinerary.DateReserved);
            this.itinerary.DepartureDate = this.dateString(this.itinerary.DepartureDate);
            this.itinerary.ReturnDate = this.dateString(this.itinerary.ReturnDate);
            this.itinerary.Itinerary.forEach(f => {
                f.departureDateString = this.timeString(f.departureAirportDate);
                f.arrivalDateString = this.timeString(f.arrivalAirportDate);
                f.departureString = this.dateString(f.departureAirportDate);
                f.arrivalString = this.dateString(f.arrivalAirportDate);
            });
        }).catch(error => this.error = error);
    }

    icon(airline){
        return `https://booking.itgtravel.net/images/logos/${airline}.gif`
    }

    timeString(date: string){
        return (new Date(date)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

    download(){
        
        let PDF = new jsPDF('p', 'mm', 'a4');
        let pdfList = Array.prototype.slice.call(document.getElementsByClassName('pdf-content'));

        var promises = pdfList.map(element => html2canvas(element));

        Promise.all(promises).then(canvi => {
            canvi.forEach(canvas => {
                let fileWidth = 208;
                let fileHeight = (canvas.height * fileWidth) / canvas.width;
                const FILEURI = canvas.toDataURL('image/png');
                let position = 0;
                PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
                if(canvi.findIndex(c => c == canvas) != canvi.length - 1) PDF.addPage();
            })
            PDF.save('e-ticket.pdf')
        });
        
    }
}