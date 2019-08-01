import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import * as mapbox from 'mapbox-gl';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

registerLocaleData(zh);

(mapbox as any).accessToken = environment.mapbox.accessToken;

platformBrowserDynamic().bootstrapModule(AppModule)
    .then(() => {
        // console.log('app bootstrap');
    })
    .catch(err => {
        console.error(err);
    });
