import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-yandex-map',
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YandexMapComponent implements AfterViewInit, OnDestroy {

  @ViewChild('yaMap') yaMapRef: ElementRef;

  willBeDestroyed = new Subject();

  constructor(
    private yandexMapService: MapService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.yandexMapService.initialized
        .pipe(filter(val => val), takeUntil(this.willBeDestroyed))
        .subscribe(() => {
          this.yandexMapService.createMap(this.yaMapRef.nativeElement);
          this.cdr.detectChanges();
        });
    }, 1000);
  }

  ngOnDestroy() {
    this.willBeDestroyed.next();
    this.willBeDestroyed.complete();
  }

}
