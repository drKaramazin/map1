import { UtilService } from '../services/util.service';

export interface IMarker {
  name: string;
  coord: number[];
}

export class Marker {

  private uuid: string;
  private placemark: any;
  public active = true;

  constructor(private marker: IMarker) {
    this.uuid = UtilService.UUID();
  }

  get(): IMarker {
    return this.marker;
  }

  getUUID(): string {
    return this.uuid;
  }

  setCoord(coord: number[]) {
    this.marker.coord = coord;
  }

  setPlacemark(polyline: any) {
    this.placemark = polyline;
  }

  getPlacemark(): any {
    return this.placemark;
  }

  getActivation(): boolean {
    return this.active;
  }

  setActivation(active: boolean) {
    this.active = active;
  }

  rename(name: string) {
    this.marker.name = name;
  }

}
