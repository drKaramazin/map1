import { Pipe, PipeTransform } from '@angular/core';

import { Marker } from '../models/marker';

@Pipe({
  name: 'markerName'
})
export class MarkerNamePipe implements PipeTransform {

  transform(marker: Marker): unknown {
    return marker.get().name;
  }

}
