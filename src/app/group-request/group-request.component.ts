import { Component } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { AccountService, AirportService, BookingService, SearchService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({ templateUrl: 'group-request.component.html', styleUrls: ['group-request.component.css'] })
export class GroupRequestComponent {
    loading = false;
    submitted = false;
    searchForm: FormGroup;
    success: boolean = false;
    filteredFromOptions: Observable<string[]>;
    filteredToOptions: Observable<string[]>;
    filteredToOJOptions: Observable<string[]>;
    filteredFromOJOptions: Observable<string[]>;
    options: string[] = [];
    error: string;
    tripType: string = "RT";
    cabinClass: string = "coach";
    showAdvanced: boolean = false;

    constructor(
        private airportService: AirportService,
        private searchService: SearchService,
        private router: Router,
        private snackBar: MatSnackBar,
        private bookingService: BookingService,
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
            maxBudget: ['', Validators.required],
            depDate: ['', Validators.required],
            retDate: ['', Validators.required],
            datesFlexible: [''],
            reoccuringGroup: [''],
            confirmedSpace: [''],
            airline: [''],
            comments:[''],
            referralName:[''],
            email:['', Validators.required],
            groupName: ['', Validators.required]
        });
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

    addEvent(event: MatDatepickerInputEvent<Date>) {
        var now = new Date(Date.now());
        event.value.setFullYear(now.getFullYear());
        if(event.value < now){
            event.value.setFullYear(event.value.getFullYear() + 1)
        }
    }
    
    get f() { return this.searchForm.controls; }

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

        this.loading = true;
        this.searchService.Request({
            start: start,
            end: end,
            startOJ: startOJ,
            endOJ: endOJ,
            type: this.tripType,
            adtPassengers: this.f.adtPassengers.value,
            maxBudget: this.f.maxBudget.value,
            airline: this.f.airline.value == "Any" ? null : this.f.airline.value,
            datesFlexible: this.f.datesFlexible.value,
            reoccuringGroup: !this.f.reoccuringGroup.value,
            confirmedSpace: this.f.confirmedSpace.value,
            email: this.f.email.value,
            referralName: this.f.referralName.value,
            groupName: this.f.groupName.value,
            comments: this.f.comments.value,
            departureDate: new Date(this.f.depDate.value).toISOString().split('T')[0],
            returnDate: new Date(this.f.retDate.value).toISOString().split('T')[0]
        }).then(() => this.success = true,
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

    formatLabel(value: number) {
        var date = new Date();
        var minuteDec = value % 1;
        date.setHours(value - minuteDec, minuteDec * 60);
        return date.toLocaleTimeString("en-us", {hour: "2-digit", minute: "2-digit"});
    }
    
}