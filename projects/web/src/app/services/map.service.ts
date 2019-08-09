import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { Map } from 'mapbox-gl';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    public map = new AsyncSubject<Map>();

}
