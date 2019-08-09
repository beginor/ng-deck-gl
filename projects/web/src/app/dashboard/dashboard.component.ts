import { Component, OnInit } from '@angular/core';

import { MapService } from '../services/map.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor(private mapSvc: MapService) { }

    public ngOnInit(): void {
        this.mapSvc.map.subscribe(map => {
            map.flyTo({
                center: { lng: 113.2, lat: 23.4 },
                zoom: 7,
                pitch: 0,
            });
        });
    }

}
