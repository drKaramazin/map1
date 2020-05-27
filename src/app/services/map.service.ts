import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

declare const ymaps: any;

import { YandexMap } from '../models/yandex-map';
import { StorageService } from './storage.service';
import { Marker } from '../models/marker';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  readonly CENTER = [55.87, 37.66];

  initialized = new BehaviorSubject<boolean>(false);
  private hasBeenInitialized = new Subject();
  private onceInit = true;

  private map: YandexMap;

  markers = new BehaviorSubject<Marker[]>([]);

  constructor(
    private storage: StorageService,
  ) {
    interval(200).pipe(takeUntil(this.hasBeenInitialized)).subscribe(() => {
      if ('yaMapReadyFlag' in window && this.onceInit) {
        this.onceInit = false;
        this.hasBeenInitialized.next();
        this.hasBeenInitialized.complete();

        this.init();
      }
    });
  }

  private init() {
    this.initialized.next(true);
  }

  createMap(element: HTMLElement) {
    this.map = new YandexMap(element, {
      center: this.CENTER,
      zoom: 10,
    });

    this.storage.readMarkers().forEach((marker) => this.createMarker(marker.get().name, marker.get().coord, marker.getActivation()));

    this.markers
      .pipe(
        map((markers) => markers.reduce((acc, cur) => cur.getActivation() ? acc.concat(cur) : acc, [])),
        filter((markers) => !!markers),
      ).subscribe((markers) => {
        this.map.setPolylineCoords(
          markers.reduce((acc, marker) => {
            acc.push(marker.get().coord);
            return acc;
          }, [])
        );
      });
  }

  private writeMarkers() {
    this.storage.writeMarkers(this.markers.value);
  }

  private dragendMarker(marker: Marker, coord: []) {
    const markers = this.markers.value.slice();
    const founded = markers.find((cur) => cur.getUUID() === marker.getUUID());
    founded.setCoord(coord);
    this.markers.next(markers);
    this.writeMarkers();
  }

  private createMarker(name: string, coord: number[] = this.map.getCenter(), active = true) {
    if (this.map) {
      const marker = new Marker({ name, coord });
      marker.setActivation(active);
      if (marker.getActivation()) {
        this.map.addMarker(marker, { dragend: this.dragendMarker.bind(this) });
      }
      const markers = [...this.markers.value, marker];
      this.markers.next(markers);
    } else {
      throw new Error('Map wasn\'t created');
    }
  }

  addMarker(name: string, coord: number[] = this.map.getCenter()) {
    this.createMarker(name, coord);
    this.writeMarkers();
  }

  removeMarker(marker: Marker) {
    const markers = this.markers.value.slice();
    const index = markers.findIndex((cur) => cur.getUUID() === marker.getUUID());
    if (index > -1) {
      this.map.deleteMarker(markers[index]);
      markers.splice(index, 1);
    }
    this.markers.next(markers);
    this.writeMarkers();
  }

  changeMarkerActivation(marker: Marker, active: boolean) {
    const markers = this.markers.value.slice();
    const founded = markers.find(cur => cur.getUUID() === marker.getUUID());

    if ((active && founded.getActivation()) || (!active && !founded.getActivation())) {
      return;
    }
    founded.setActivation(active);

    if (active) {
      this.map.addMarker(founded, { dragend: this.dragendMarker.bind(this) });
    } else {
      this.map.deleteMarker(founded);
    }

    this.markers.next(markers);
    this.writeMarkers();
  }

  orderMarkers(uuids: string[]) {
    const markers = this.markers.value.slice();
    this.markers.value.forEach(marker => marker.getActivation() && this.map.deleteMarker(marker));
    this.markers.next([]);
    for (const uuid of uuids) {
      const founded = markers.find((cur) => cur.getUUID() === uuid);
      if (founded) {
        this.createMarker(founded.get().name, founded.get().coord, founded.getActivation());
      }
    }
    this.writeMarkers();
  }

  renameMarker(marker: Marker, name: string) {
    const markers = this.markers.value.slice();
    const founded = markers.find((cur) => cur.getUUID() === marker.getUUID());
    if (founded) {
      founded.rename(name);
      this.map.deleteMarker(marker);
      this.map.addMarker(marker, { dragend: this.dragendMarker.bind(this) });
      this.markers.next(markers);
    }
    this.writeMarkers();
  }

}
