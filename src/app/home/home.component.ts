import { Component } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { AirportService, SearchService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({ templateUrl: 'home.component.html', styleUrls: ['home.component.css'] })
export class HomeComponent {
    loading = false;
    submitted = false;
    searchForm: FormGroup;
    itineraries: any[] = [];
    filteredFromOptions: Observable<string[]>;
    filteredToOptions: Observable<string[]>;
    filteredToOJOptions: Observable<string[]>;
    filteredFromOJOptions: Observable<string[]>;
    options: string[] = [];
    error: string;
    tripType: string = "RT";
    showAdvanced: boolean = false;

    constructor(
        private airportService: AirportService,
        private searchService: SearchService,
        private formBuilder: FormBuilder) { }

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

    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
    
        return this.options.filter(option => option.toLowerCase().includes(filterValue)).slice(0, 5);
    }
    
    get f() { return this.searchForm.controls; }

    dateString(date: string){
        return (new Date(date)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        
        this.loading = true;
        this.searchService.Search({
            start: start,
            end: end,
            startOJ: startOJ,
            endOJ: endOJ,
            type: this.tripType,
            adtPassengers: this.f.adtPassengers.value,
            cldPassengers: this.f.cldPassengers.value,
            airline: this.f.airline.value == "Any" ? null : this.f.airline.value,
            maxConnectionTime: this.f.connectionTime.value,
            bundledFaresOnly: this.f.bundledFaresOnly.value,
            directFlights: this.f.directFlights.value,
            departureDate: new Date(this.f.depDate.value).toISOString().split('T')[0],
            returnDate: new Date(this.f.retDate.value).toISOString().split('T')[0]
        }).then(data => this.itineraries = data,
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
    
}