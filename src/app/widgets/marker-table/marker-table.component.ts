import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

declare const dragula: any;

import { MapService } from '../../services/map.service';
import { Marker } from '../../models/marker';

enum EditMode { Add, Edit }

@Component({
  selector: 'app-marker-table',
  templateUrl: './marker-table.component.html',
  styleUrls: ['./marker-table.component.scss'],
})
export class MarkerTableComponent implements OnInit, AfterViewInit {

  @ViewChild('markersContainer') markersContainer: ElementRef;

  form: FormGroup;
  showError = false;
  markers: Marker[] = [];
  editMode: EditMode = EditMode.Add;
  currentMarker: Marker;

  constructor(
    private formBuilder: FormBuilder,
    public mapService: MapService,
  ) { }

  ngAfterViewInit() {
    dragula([this.markersContainer.nativeElement]).on('drop', () => {
      const uuids = [];
      this.markersContainer.nativeElement.childNodes.forEach((child) => {
        if (child.dataset) {
          uuids.push(child.dataset.uuid);
        }
      });
      this.mapService.orderMarkers(uuids);
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
    });
  }

  submit(value: { name: string }) {
    this.showError = true;
    if (this.form.valid) {
      if (this.editMode === EditMode.Add) {
        this.mapService.addMarker(value.name);
      } else {
        this.mapService.renameMarker(this.currentMarker, value.name);
      }
      this.form.controls.name.patchValue('');
      this.showError = false;
    }
  }

  delete(marker: Marker) {
    this.mapService.removeMarker(marker);
  }

  flipActivation(marker: Marker) {
    this.mapService.changeMarkerActivation(marker, !marker.getActivation());
  }

  rename(marker: Marker) {
    this.form.controls.name.patchValue(marker.get().name);
    this.currentMarker = marker;
    this.editMode = EditMode.Edit;
  }

}
