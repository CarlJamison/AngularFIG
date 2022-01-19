import { Component } from '@angular/core';
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
                        MiddleName: ['', Validators.required],
                        Gender: ['', Validators.required],
                        Birthday: ['', Validators.required]
                    }),
                    travelerType: f.travelerType
                })
            }
        });

        this.form = this.formBuilder.group({
            creditCard: ['', [CreditCardValidators.validateCCNumber]],
            expirationDate: ['', [CreditCardValidators.validateExpDate]],
            cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]] 
        });

        this.expirationTime = (new Date(this.confirmation.expiration)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    book(){
    }

    onSubmit(value){

    }
    
}