import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { RiverComponent } from './river/river.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'vehicle',
        component: VehicleComponent
    },
    {
        path: 'river',
        component: RiverComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true,
            enableTracing: false
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
