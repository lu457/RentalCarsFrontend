import { Routes } from '@angular/router';
import { VehiculoDetailComponent } from './features/vehiculos/vehiculo-detail/vehiculo-detail.component';
import { VehiculoListComponent } from './features/vehiculos/vehiculo-list/vehiculo-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ReservasComponent } from './features/reservas/reservas.component';

export const routes: Routes = [
    {path: '', component: VehiculoListComponent },
    {path: 'vehiculo/id', component: VehiculoDetailComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'mis-reservas', component: ReservasComponent}
];
