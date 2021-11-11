import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin';
import { ForgotAccountComponent } from './forgot-account';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { CreateAccountComponent } from './create-account';
import { AdminGuard } from './admin/admin.guard';

const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard]  },
    { path: 'bookings', component: AdminComponent, canActivate: [AuthGuard, AdminGuard]  },
    { path: 'account', component: AdminComponent, canActivate: [AuthGuard, AdminGuard]  },
    { path: 'forgotPassword', component: ForgotAccountComponent },
    { path: 'createAccount', component: CreateAccountComponent },


    // otherwise redirect to home
    { path: '**', redirectTo: 'home' }
];

export const appRoutingModule = RouterModule.forRoot(routes);