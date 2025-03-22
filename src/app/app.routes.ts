import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ReservasComponent } from './features/reservas/reservas.component';
import { VehiculoDetailComponent } from './features/vehiculos/vehiculo-detail/vehiculo-detail.component';
import { VehiculoFormComponent } from './features/vehiculos/vehiculo-form/vehiculo-form.component';
import { VehiculoListComponent } from './features/vehiculos/vehiculo-list/vehiculo-list.component';

export const routes: Routes = [
    {path: '', component: VehiculoListComponent },
    {path: 'vehiculo/:id', component: VehiculoDetailComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {
        path: 'vehiculos/new', 
        component: VehiculoFormComponent,
        canActivate: [authGuard],
    },
    {
        path: 'mis-reservas',
        component: ReservasComponent,
        canActivate: [authGuard],
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
];
