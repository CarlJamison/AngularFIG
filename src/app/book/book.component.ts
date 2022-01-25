﻿import { Component } from '@angular/core';
import { BookingService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditCardValidators } from 'angular-cc-library';

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

    constructor(
        private bookingService: BookingService,
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
                        Birthday: ['', Validators.required]
                    }),
                    travelerType: f.travelerType
                })
            }
        });

        this.form = this.formBuilder.group({
            phoneNumber: ['', [Validators.required]],
            creditCard: ['', [CreditCardValidators.validateCCNumber]],
            expirationDate: ['', [CreditCardValidators.validateExpDate]],
            cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]] 
        });
        var expTime = new Date(this.confirmation.expiration)
        expTime.setHours(expTime.getHours() + 1);
        this.expirationTime = (expTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    onSubmit(){
        this.submitted = true;
        if (this.fares.some(f => f.form.invalid) || this.loading) {
            return;
        }

        this.loading = true;

        var passengersArray = this.fares.map(f => ({
            TravelerType: f.travelerType,
            FirstName: f.form.controls.FirstName.value,
            LastName: f.form.controls.LastName.value,
            MiddleName: f.form.controls.MiddleName.value,
            Gender: f.form.controls.Gender.value,
            BirthDate: f.form.controls.Birthday.value               
        }));

        var passengers = {
            Passengers: passengersArray,
            PassengerPhone: this.form.controls.phoneNumber.value,
            Itinerary: this.itinerary
        };

        this.bookingService.book(passengers).then(() => this.loading = false);
    }
    
}