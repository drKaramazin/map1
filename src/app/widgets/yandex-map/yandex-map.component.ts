import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { YandexMapService } from '../../services/yandex-map.service';

@Component({
  selector: 'app-yandex-map',
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YandexMapComponent implements AfterViewInit, OnDestroy {

  @ViewChild('yaMap') yaMapRef: ElementRef;

  willBeDestroyed = new Subject();

  yaMap: any;

  constructor(
    private yandexMapService: YandexMapService,
    private cdr: ChangeDetectorRef,
  ) { }

  initMap() {
    this.yaMap = new (this.yandexMapService.ymaps().Map)(this.yaMapRef.nativeElement, {
      center: [55.87, 37.66],
      zoom: 10,
    });
  }

  ngAfterViewInit(): void {
    this.yandexMapService.initialized.pipe(filter(val => val), takeUntil(this.willBeDestroyed))
      .subscribe(() => this.initMap());
  }

  ngOnDestroy() {
    this.willBeDestroyed.next();
    this.willBeDestroyed.complete();
  }

}
