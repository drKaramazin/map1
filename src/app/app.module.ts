import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './sections/home/home.component';
import { MarkerTableComponent } from './widgets/marker-table/marker-table.component';
import { YandexMapComponent } from './widgets/yandex-map/yandex-map.component';

import { initApp } from './app.initializer';

import { MapService } from './services/map.service';
import { StorageService } from './services/storage.service';
import { UtilService } from './services/util.service';
import { MarkerNamePipe } from './pipes/marker-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MarkerTableComponent,
    YandexMapComponent,
    MarkerNamePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
    },
    MapService,
    StorageService,
    UtilService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
