import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { initApp } from './app.initializer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './sections/home/home.component';
import { MarkerTableComponent } from './widgets/marker-table/marker-table.component';
import { YandexMapComponent } from './widgets/yandex-map/yandex-map.component';
import { YandexMapService } from './services/yandex-map.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MarkerTableComponent,
    YandexMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
    },
    YandexMapService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
