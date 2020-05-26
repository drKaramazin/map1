import { Marker } from './marker';

declare const ymaps: any;

export class YandexMap {

  map: any;
  polyline: any;

  constructor(...args) {
    this.map = new ymaps.Map(...args);
    this.polyline = new ymaps.Polyline([], {}, {
      strokeColor: '#cccccc',
      strokeWidth: 4,
    });
    this.map.geoObjects.add(this.polyline);
  }

  addMarker(marker: Marker, events?: { dragend?: (marker, coord) => void }) {
    const placemark = new ymaps.Placemark(marker.get().coord, { balloonContent: marker.get().name }, { draggable: true });
    if (events) {
      if (events.dragend) {
        placemark.events.add('dragend', () => events.dragend(marker, placemark.geometry.getCoordinates()));
      }
    }
    this.map.geoObjects.add(placemark);
    marker.setPlacemark(placemark);
  }

  deleteMarker(marker: Marker) {
    this.map.geoObjects.remove(marker.getPlacemark());
  }

  setPolylineCoords(coords: number[][]) {
    this.polyline.geometry.setCoordinates(coords);
  }

  getCenter(): number[] {
    return this.map.getCenter();
  }

}
