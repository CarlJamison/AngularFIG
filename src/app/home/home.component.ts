import { Component } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { AccountService, AirportService, BookingService, SearchService } from '@app/_services';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';

@Component({ templateUrl: 'home.component.html', styleUrls: ['home.component.css'] })
export class HomeComponent {
    loading = false;
    submitted = false;
    searchForm: UntypedFormGroup;
    itineraries: any[] = [];
    filteredFromOptions: Observable<string[]>;
    filteredToOptions: Observable<string[]>;
    filteredToOJOptions: Observable<string[]>;
    filteredFromOJOptions: Observable<string[]>;
    options: string[] = [];
    error: string;
    tripType: string = "RT";
    searchedTripType: string;
    cabinClass: string = "coach";
    showAdvanced: boolean = false;
    showPostSearch: boolean = true;
    numStops: any = {NonStop: true, OneStop: true, TwoStop: true};
    departureFromTime: number = 0;
    departureToTime: number = 24;
    arrivalFromTime: number = 0;
    arrivalToTime: number = 24;
    retDepartureFromTime: number = 0;
    retDepartureToTime: number = 24;
    retArrivalFromTime: number = 0;
    retArrivalToTime: number = 24;
    contractTypes: any[];
    sliceStart: number = 0;
    sliceLength: number = 10;
    postSearchAirline: string = "Any";

    constructor(
        private airportService: AirportService,
        private searchService: SearchService,
        private router: Router,
        private snackBar: MatSnackBar,
        private accountService: AccountService,
        private bookingService: BookingService,
        private formBuilder: UntypedFormBuilder) { }

    airlines(){
        return this.airportService.Airlines();
    }

    ngOnInit() {
        this.options = this.airportService.List();
        
        this.searchForm = this.formBuilder.group({
            from: ['', Validators.required],
            to: ['', Validators.required],
            fromOJ: [''],
            toOJ: [''],
            adtPassengers: ['', Validators.required],
            cldPassengers: ['', Validators.required],
            depDate: ['', Validators.required],
            retDate: ['', Validators.required],
            bundledFaresOnly: [''],
            directFlights: [''],
            connectionTime: [''],
            airline: ['']
        });

        this.f.adtPassengers.setValue(1);
        this.f.cldPassengers.setValue(0);
        this.f.bundledFaresOnly.setValue(false);
        this.f.directFlights.setValue(false);
        this.f.connectionTime.setValue(0);
        this.f.airline.setValue("Any");

        this.filteredFromOptions = this.f.from.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)));
        this.filteredToOptions = this.f.to.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)));

        this.filteredFromOJOptions = this.f.fromOJ.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)));
        this.filteredToOJOptions = this.f.toOJ.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)));

        this.accountService.ProfileDetails().then(c => {
            this.contractTypes = [];
            if(c.HasCON) this.contractTypes.push({ Value: "PRI", Name: "Consolidated", Include: true, PostInclude: true});
            if(c.HasMIS) this.contractTypes.push({ Value: "MIS", Name: "Humanitarian", Include: true, PostInclude: true});
            if(c.HasPUB) this.contractTypes.push({ Value: "PUB", Name: "Published", Include: true, PostInclude: true});
            this.f.from.setValue(c.DefaultAirport);
        })

    }

    public getTotalPrice(itinerary){
        var numberOfFares = itinerary.fares.reduce((partial_sum, a) => partial_sum + +a.numPax, 0);
        return ((numberOfFares * +itinerary.markup + +itinerary.totalCcPrice) * 1.04).toFixed(2);
    }

    public toAmount(amount){
        return (+amount).toFixed(2)
    }

    public getFareType(fare){
        var fareType = fare.travelerType;
        return fareType == 'ADT' ? 'Adult' : fareType == 'CHD' ? 'Child' : fareType;
    }

    public getFareAmount(fare, itinerary){
        return (+fare.ccPricePerPax + +itinerary.markup) * 1.04;
    }

    public getAverageAmount(itinerary){
        var numberOfFares = itinerary.fares.reduce((partial_sum, a) => partial_sum + +a.numPax, 0);
        return (+this.getTotalPrice(itinerary) / numberOfFares).toFixed(2);
    }

    public getFlights(flights, id){
        return flights.filter(f => f.tripId == id);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
    
        return this.options.filter(option => option.toLowerCase().includes(filterValue)).slice(0, 5);
    }

    addEvent(event: MatDatepickerInputEvent<Date>) {
        var now = new Date(Date.now());
        event.value.setFullYear(now.getFullYear());
        if(event.value < now){
            event.value.setFullYear(event.value.getFullYear() + 1)
        }
    }
    
    get f() { return this.searchForm.controls; }

    get displayItineraries(){
        return this.filteredItineraries.slice(this.sliceStart, this.sliceStart + this.sliceLength);
    }

    get filteredItineraries() {
        return this.itineraries.filter(i => {
            var stops = this.tripType == 'OW' ? i.flights.length : i.flights.length / 2;
            //{NonStop: true, OneStop: true, TwoStop: true};

            return (stops == 1 && this.numStops.NonStop)
                || (stops == 2 && this.numStops.OneStop)
                || (stops >= 3 && this.numStops.TwoStop);
        }).filter(i => {
            if(this.departureFromTime == 0 && this.departureToTime == 24 &&
                this.arrivalFromTime == 0 && this.arrivalToTime == 24) return true;
            var outboundFlights = this.getFlights(i.flights, '1')
            var depFlight = new Date(outboundFlights[0].departureAirportDate);
            var arrFlight = new Date(outboundFlights[outboundFlights.length - 1].arrivalAirportDate);
            var dep = depFlight.getHours() + (depFlight.getMinutes() / 60);
            var arr = arrFlight.getHours() + (arrFlight.getMinutes() / 60);

            return this.departureFromTime < dep && dep < this.departureToTime
                && this.arrivalFromTime < arr && arr < this.arrivalToTime;
        /*}).filter(i => {
            return i.flights.every(f => {
                if(f == i.flights[0]) return true;
                var last = i.flights[i.flights.findIndex(l => l == f) - 1];
                if(last.tripId != f.tripId) return true;
                var connection = Math.abs(new Date(last.arrivalAirportDate).getTime() - new Date(f.departureAirportDate).getTime()) / 36e5;
                console.log(connection)
                return true;
            });*/
        }).filter(i => {
            if(this.searchedTripType == 'OW') return true;
            if(this.retDepartureFromTime == 0 && this.retDepartureToTime == 24 &&
                this.retArrivalFromTime == 0 && this.retArrivalToTime == 24) return true;
            var returnFlights = this.getFlights(i.flights, '2')
            var depFlight = new Date(returnFlights[0].departureAirportDate);
            var arrFlight = new Date(returnFlights[returnFlights.length - 1].arrivalAirportDate);
            var dep = depFlight.getHours() + (depFlight.getMinutes() / 60);
            var arr = arrFlight.getHours() + (arrFlight.getMinutes() / 60);

            return this.retDepartureFromTime < dep && dep < this.retDepartureToTime
                && this.retArrivalFromTime < arr && arr < this.retArrivalToTime;
        }).filter(i => this.contractTypes.some(c => c.Value == i.contractType && c.PostInclude))
        .filter(i => this.postSearchAirline == "Any" || i.validatingCarrier == this.postSearchAirline);
    }

    timeString(date: string){
        return (new Date(date)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    dateString(date: string){
        return (new Date(date)).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }

    search(){
        this.error = null;
        if(this.tripType == "OW" && (!this.f.retDate.value || !this.f.retDate.value.length)){
            this.f.retDate.setValue(this.f.depDate.value);
        }
        // stop here if form is invalid
        if (this.searchForm.invalid || this.loading) {
            return;
        }

        var start = this.getCode(this.f.from.value);
        var end = this.getCode(this.f.to.value);

        if(!start || !end){
            this.error = "Invalid start or end location"
            return;
        }

        var startOJ = null;
        var endOJ = null;
        if(this.tripType == "OJ"){
            var startOJ = this.getCode(this.f.fromOJ.value);
            var endOJ = this.getCode(this.f.toOJ.value);

            if(!startOJ || !endOJ){
                this.error = "Invalid Open Jaw start or end location"
                return;
            }
        }

        this.itineraries = [];
        this.searchedTripType = this.tripType;
        this.loading = true;
        this.searchService.Search({
            cabinClass: this.cabinClass,
            start: start,
            end: end,
            startOJ: startOJ,
            endOJ: endOJ,
            type: this.tripType,
            adtPassengers: this.f.adtPassengers.value,
            cldPassengers: this.f.cldPassengers.value,
            airline: this.f.airline.value == "Any" ? null : this.f.airline.value,
            maxConnectionTime: this.f.connectionTime.value,
            bundledFaresOnly: !this.f.bundledFaresOnly.value,
            directFlights: this.f.directFlights.value,
            departureDate: new Date(this.f.depDate.value).toISOString().split('T')[0],
            returnDate: new Date(this.f.retDate.value).toISOString().split('T')[0],
            hasCON: this.contractTypes.some(c => c.Value == "PRI" && c.Include),
            hasMIS: this.contractTypes.some(c => c.Value == "MIS" && c.Include),
            hasPUB: this.contractTypes.some(c => c.Value == "PUB" && c.Include)
        }).then(data => {
            this.itineraries = data;
            this.itineraries.forEach(i => {
                i.flights.forEach(f => {
                    f.departureDateString = this.timeString(f.departureAirportDate);
                    f.arrivalDateString = this.timeString(f.arrivalAirportDate);
                    f.departureString = this.dateString(f.departureAirportDate);
                    f.arrivalString = this.dateString(f.arrivalAirportDate);
                });
            })
        },
                error => this.error = error)
                .finally(()=> this.loading = false);
    }

    getCode(airport){
        airport = airport.toUpperCase();

        if(airport.length >= 5){
            airport =  this.airportService.GetCode(airport);
        }

        if(airport.length == 3){
            return this.airportService.List()
                .some(a => this.airportService.GetCode(a) == airport) ? airport : null
        }else{
            return null
        }
    }

    icon(airline){
        return `https://booking.itgtravel.net/images/logos/${airline}.gif`
    }

    book(itinerary){
        this.bookingService.set(itinerary);
        this.bookingService.confirm()
            .then(() => this.router.navigate(['book']))
            .catch(error => this.snackBar.open(error, null, {duration: 9000}));
    }

    formatLabel(value: number) {
        var date = new Date();
        var minuteDec = value % 1;
        date.setHours(value - minuteDec, minuteDec * 60);
        return date.toLocaleTimeString("en-us", {hour: "2-digit", minute: "2-digit"});
    }

    forward(){
        this.sliceStart += this.sliceLength
    }
    back(){
        this.sliceStart -= this.sliceLength
    }
    
}