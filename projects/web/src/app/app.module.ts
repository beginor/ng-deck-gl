import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppSharedModule } from 'app-shared';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { RiverComponent } from './river/river.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        VehicleComponent,
        RiverComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        // NgbModule,
        AppSharedModule,
        AppRoutingModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'zh-Hans' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
