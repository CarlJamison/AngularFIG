import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({ templateUrl: 'home.component.html', styleUrls: ['home.component.css'] })
export class HomeComponent {
    loading = false;
    submitted = false;
    searchForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            from: ['', Validators.required],
            to: ['', Validators.required],
            adtPassengers: ['', Validators.required],
            depDate: ['', Validators.required],
            retDate: ['', Validators.required]
        });
    }
    
    get f() { return this.searchForm.controls; }

    search(){
        console.log("Search");
    }
    
}