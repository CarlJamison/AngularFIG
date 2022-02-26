import { Component } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'feedback.component.html', styleUrls: ['feedback.component.css'] })
export class FeedbackComponent {
    loading = false;
    success = false;
    feedbackText = "";

    constructor(
        private accountService: AccountService) {}

    submit(){
        if(this.loading || !this.feedbackText.length) return;
        this.loading = true;

        this.accountService.SubmitFeedback(this.feedbackText).then(() => this.success = true);
    }
}