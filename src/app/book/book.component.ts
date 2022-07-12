import { Component } from '@angular/core';
import { AirportService, BookingService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditCardValidators } from 'angular-cc-library';
import { Router } from '@angular/router';

@Component({ templateUrl: 'book.component.html', styleUrls: ['book.component.css'] })
export class BookComponent {
    loading = false;
    submitted = false;
    form: FormGroup;
    error: string;
    itinerary;
    confirmation;
    expirationTime;
    fares = [];
    doPurchaseStep = false;

    constructor(
        private bookingService: BookingService,
        private router: Router,
        private airportService: AirportService,
        private formBuilder: FormBuilder) { }

    ngOnInit() { 
        this.itinerary = this.bookingService.get();
        this.confirmation = this.bookingService.getConfirmation();

        this.itinerary.fares.forEach(f => {
            for(var i = 0; i < f.numPax; i++){
                this.fares.push({
                    form: this.formBuilder.group({
                        FirstName: ['', Validators.required],
                        LastName: ['', Validators.required],
                        MiddleName: [''],
                        Gender: ['', Validators.required],
                        Birthday: ['', Validators.required],
                        PassportId: [''],
                        PassportExpiration: [''],
                        PassportCountry: [''],
                        RedressNumber: [''],
                        RedressCountry: ['']
                    }),
                    travelerType: f.travelerType
                })
            }
        });

        this.form = this.formBuilder.group({
            contactPhoneNumber: ['', [Validators.required]],
            contactEmail: ['', [Validators.required]],
            billingReference: [''],
            /*creditCard: ['', [CreditCardValidators.validateCCNumber]],
            expirationDate: ['', [CreditCardValidators.validateExpDate]],
            cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]*/ 
        });
        var expTime = new Date(this.confirmation.expiration)
        expTime.setHours(expTime.getHours() + 1);
        this.expirationTime = (expTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
        
    get f() { return this.form.controls; }
    get countries() { return this.airportService.Countries(); }

    onSubmit(){
        this.submitted = true;
        this.error = null;
        if(!this.doPurchaseStep) this.f.billingReference.setValue(" ");
        if (this.fares.some(f => f.form.invalid) || this.form.invalid || this.loading) {
            return;
        }

        this.loading = true;

        var passengersArray = this.fares.map(f => ({
            TravelerType: f.travelerType,
            FirstName: f.form.controls.FirstName.value,
            LastName: f.form.controls.LastName.value,
            MiddleName: f.form.controls.MiddleName.value,
            Gender: f.form.controls.Gender.value,
            BirthDate: new Date(f.form.controls.Birthday.value).toISOString().split('T')[0],
            PassportNumber: f.form.controls.PassportId.value,
            PassportExpDate: f.form.controls.PassportExpiration.value.length ? 
                new Date(f.form.controls.PassportExpiration.value).toISOString().split('T')[0] : "",
            PassportCountry: f.form.controls.PassportCountry.value,
            RedressNumber: f.form.controls.RedressNumber.value,
            RedressCountry: f.form.controls.RedressCountry.value               
        }));

        var passengers = {
            Passengers: passengersArray,
            PassengerPhone: this.f.contactPhoneNumber.value,
            ContactPhone: this.f.contactPhoneNumber.value,
            ContactEmail: this.f.contactEmail.value,
            Itinerary: this.itinerary
        };

        this.bookingService.book(passengers)
            .then(booking => this.purchase(booking))
            .catch(error => this.error = error)
            .finally(() => this.loading = false);
    }

    purchase(booking){
        if(!this.doPurchaseStep) {
            this.router.navigate(['bookings']);
        } else {
            this.bookingService.purchase(booking, this.f.billingReference.value)
                .then(() => this.router.navigate(['bookings']))
                .catch(error => this.error = error)
                .finally(() => this.loading = false);
        }
    }
    
}