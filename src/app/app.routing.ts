import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin';
import { ForgotAccountComponent } from './forgot-account';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { CreateAccountComponent } from './create-account';
import { AdminGuard } from './admin/admin.guard';
import { AccountComponent } from './account';
import { BookComponent } from './book';
import { BookingsComponent } from './bookings';
import { ItineraryComponent } from './itinerary';

const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'book', component: BookComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard]  },
    { path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard]  },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard]  },
    { path: 'forgotPassword', component: ForgotAccountComponent },
    { path: 'Register', component: CreateAccountComponent },
    { path: 'itinerary', component: ItineraryComponent },
    { path: 'feedback', component: AccountComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: 'home' }
];

export const appRoutingModule = RouterModule.forRoot(routes);