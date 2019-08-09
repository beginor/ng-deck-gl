import {
    Component, OnInit, ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Map } from 'mapbox-gl';
import {
    FeatureCollection, MultiPolygon, LineString, MultiLineString
} from 'geojson';
import { bbox } from '@turf/turf';

import { MapService } from '../services/map.service';

declare var deck: any;

@Component({
    selector: 'app-river',
    templateUrl: './river.component.html',
    styleUrls: ['./river.component.scss']
})
export class RiverComponent implements OnInit, OnDestroy {

    private border: FeatureCollection<MultiPolygon>;
    private river: FeatureCollection<LineString | MultiLineString>;
    private trips: any[];
    private tripsLayer: any;
    private animationFrame: number;

    constructor(
        private http: HttpClient,
        private mapSvc: MapService
    ) { }

    public ngOnInit(): void {
        this.mapSvc.map.subscribe(async map => {
            await this.addBorder(map);
            await this.addRiver(map);
            this.addRiverTrips(map);
            this.animate();
        });
    }

    public ngOnDestroy(): void {
        this.mapSvc.map.subscribe(map => {
            this.removeBorder(map);
            this.removeRiver(map);
            this.removeRiverTrips(map);
        });
        if (!!this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    private async addBorder(map: Map): Promise<void> {
        this.border = await this.http.get<any>(
            './assets/gd-prov-border.json'
        ).toPromise();
        const box = bbox(this.border);
        map.fitBounds(box as any, { padding: 10 });
        map.addSource(
            'gd-prov-border',
            { type: 'geojson', data: this.border }
        );
        map.addLayer({
            id: 'gd-prov-border',
            type: 'line',
            source: 'gd-prov-border',
            paint: {
                'line-color': '#ff0000',
                'line-width': 2,
                // 'line-dasharray': [4, 4]
            }
        });
    }

    private removeBorder(map: Map): void {
        map.removeLayer('gd-prov-border');
        map.removeSource('gd-prov-border');
    }

    private async addRiver(map: Map): Promise<void> {
        this.river = await this.http.get<any>(
            './assets/gd-river-0123.json'
        ).toPromise();
        map.addSource(
            'gd-river',
            { type: 'geojson', data: this.river }
        );
        map.addLayer({
            id: 'gd-river',
            type: 'line',
            source: 'gd-river',
            paint: {
                'line-color': '#cccccc',
                'line-width': 1,
                // 'line-dasharray': [4, 4]
            }
        });
    }

    private removeRiver(map: Map): void {
        map.removeLayer('gd-river');
        map.removeSource('gd-river');
    }

    private addRiverTrips(map: Map): void {
        this.trips = [];
        for (const f of this.river.features) {
            const trip = {
                id: f.id,
                name: f.properties['name'],
                level: f.properties['level'],
                segments: []
            };
            if (f.geometry.type === 'LineString') {
                trip.segments = f.geometry.coordinates;
            }
            else {
                const ml = f.geometry as MultiLineString;
                for (const line of ml.coordinates) {
                    for (const coord of line) {
                        trip.segments.push(coord);
                    }
                }
            }
            this.trips.push(trip);
        }
        for (const trip of this.trips) {
            let i = 0;
            for (const seg of trip.segments) {
                seg.push(i);
                i++;
            }
        }
        this.tripsLayer = new deck.MapboxLayer({
            id: 'river-trips',
            type: deck.TripsLayer,
            data: this.trips,
            getPath: d => d.segments,
            getColor: [255, 0, 0],
            opacity: 0.7,
            widthMinPixels: 4,
            rounded: true,
            trailLength: 180,
            currentTime: 180
        });
        map.addLayer(this.tripsLayer);
    }

    private removeRiverTrips(map: Map): void {
        map.removeLayer('river-trips');
    }

    private animate(): void {
        const loopLength = 1800 * 2;
        const animationSpeed = 100;
        const timestamp = Date.now() / 1000;
        const loopTime = loopLength / animationSpeed;
        const currentTime = ((timestamp % loopTime) / loopTime) * loopLength;
        this.tripsLayer.setProps({ currentTime });
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }

}
