import { Injectable } from '@angular/core';

import { Marker, IMarker } from '../models/marker';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  readonly MARKERS_ITEM = 'markers';

  constructor() { }

  writeMarkers(markers: Marker[]) {
    localStorage.setItem(
      this.MARKERS_ITEM,
      JSON.stringify(
        markers.reduce((acc, marker) => {
          const cur: any = marker.get();
          cur.active = marker.getActivation();
          acc.push(cur);
          return acc;
        }, [])
      )
    );
  }

  readMarkers(): Marker[] {
    const item = localStorage.getItem(this.MARKERS_ITEM);
    return item ? (JSON.parse(item) as any[]).reduce((acc, cur) => {
      const marker: Marker = new Marker(cur);
      marker.setActivation(cur.active);
      acc.push(marker);
      return acc;
    }, []) : [];
  }

}
