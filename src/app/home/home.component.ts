import { Component } from '@angular/core';
import { first, map, startWith } from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import { User } from '@app/_models';
import { AirportService, SearchService, UserService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({ templateUrl: 'home.component.html', styleUrls: ['home.component.css'] })
export class HomeComponent {
    loading = false;
    submitted = false;
    searchForm: FormGroup;
    itineraries: any[] = [];
    fromControl = new FormControl();
    filteredFromOptions: Observable<string[]>;
    toControl = new FormControl();
    filteredToOptions: Observable<string[]>;
    options: string[] = [];
    error: string;

    constructor(
        private airportService: AirportService,
        private searchService: SearchService,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.options = this.airportService.List();
        
        this.searchForm = this.formBuilder.group({
            from: ['', Validators.required],
            to: ['', Validators.required],
            adtPassengers: ['', Validators.required],
            depDate: ['', Validators.required],
            retDate: ['', Validators.required]
        });
        this.filteredFromOptions = this.f.from.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)));
        this.filteredToOptions = this.f.to.valueChanges.pipe(
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
        
        this.loading = true;
        this.searchService.Search({
            start: start,
            end: end,
            adtPassengers: this.f.adtPassengers.value,
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