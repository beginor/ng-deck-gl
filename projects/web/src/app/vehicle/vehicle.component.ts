import {
    Component, ViewChild, AfterViewInit, OnInit, OnDestroy, ElementRef, NgZone
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { Map } from 'mapbox-gl';

import { MapService } from '../services/map.service';

declare var deck: any;

@Component({
    selector: 'app-vehicle',
    templateUrl: './vehicle.component.html',
    styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit, OnDestroy {

    private map$: Subscription;
    private tripsLayer: any;
    private animationFrame: number;

    constructor(
        private zone: NgZone,
        private http: HttpClient,
        private mapSvc: MapService
    ) { }

    public ngOnInit(): void {
        this.mapSvc.map.subscribe(map => {
            map.flyTo({
                center: { lng: -74.0123409459859, lat: 40.704499769452724 },
                zoom: 14,
                pitch: 45,
            });
            this.addMapboxBuildingsLayer(map);
            this.addTripsLayer(map)
                .then(() => {
                    this.animate();
                })
                .catch(ex => console.error(ex));;
        });
    }

    public ngOnDestroy(): void {
        if (!!this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.mapSvc.map.subscribe(map => {
            map.removeLayer('buildings')
                .removeLayer('3d-buildings')
                .removeLayer('trips');
        });
    }

    private addDeckBuildingLayer(map: Map): void {
        const layer = new deck.MapboxLayer({
            id: 'buildings',
            type: deck.PolygonLayer,
            data: './assets/buildings.json',
            extruded: true,
            wireframe: false,
            opacity: 0.5,
            getPolygon: f => f.polygon,
            getElevation: f => f.height,
            getFillColor: [74, 80, 87]
        });
        map.addLayer(layer);
    }

    private addMapboxBuildingsLayer(map: Map): void {
        const labelLayer = map.getStyle().layers.find(
            layer => layer.type === 'symbol' && !!layer.layout['text-field']
        );
        const labelLayerId = labelLayer.id;
        map.addLayer({
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 13,
            paint: {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': .6
            }
        }, labelLayerId);
    }

    private async addTripsLayer(map: Map): Promise<void> {
        const trips = await this.http.get<any>('./assets/trips.json')
            .toPromise();
        this.tripsLayer = new deck.MapboxLayer({
            id: 'trips',
            type: deck.TripsLayer,
            data: trips,
            getPath: d => d.segments,
            getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
            opacity: 0.3,
            widthMinPixels: 2,
            rounded: true,
            trailLength: 180,
            currentTime: 180
        });
        map.addLayer(this.tripsLayer);
    }

    private animate(): void {
        const loopLength = 1800;
        const animationSpeed = 30;
        const timestamp = Date.now() / 1000;
        const loopTime = loopLength / animationSpeed;
        const currentTime = ((timestamp % loopTime) / loopTime) * loopLength;
        this.tripsLayer.setProps({ currentTime });
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }

}
