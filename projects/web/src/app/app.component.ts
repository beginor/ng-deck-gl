import {
    Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy
} from '@angular/core';

import { Map, NavigationControl } from 'mapbox-gl';

import { MapService } from './services/map.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('mapEl', { static: true })
    public mapEl: ElementRef<HTMLDivElement>;

    private map: Map;

    constructor(
        private mapSvc: MapService
    ) { }

    public ngOnInit(): void {
    }

    public ngAfterViewInit(): void {
        this.map = new Map({
            container: this.mapEl.nativeElement,
            style: 'mapbox://styles/mapbox/dark-v9',
            center: { lng: 113.2, lat: 23.4 },
            zoom: 7,
            pitch: 0,
            attributionControl: false
        });
        this.map.addControl(
            new NavigationControl({
                showZoom: true,
                showCompass: true
            }),
            'top-left'
        );
        this.mapSvc.map.next(this.map);
        this.map.on('load', () => {
            console.log('map loaded');
            this.mapSvc.map.complete();
        });
    }

    public ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

}
