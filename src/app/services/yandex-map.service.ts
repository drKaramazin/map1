import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare const ymaps: any;

@Injectable({
  providedIn: 'root'
})
export class YandexMapService {

  initialized = new BehaviorSubject<boolean>(false);
  private hasBeenInitialized = new Subject();
  private onceInit = true;

  constructor() {
    interval(200).pipe(takeUntil(this.hasBeenInitialized)).subscribe(() => {
      if ('ymaps' in window && this.onceInit) {
        this.onceInit = false;
        this.hasBeenInitialized.next();
        this.hasBeenInitialized.complete();

        ymaps.ready(() => this.init());
      }
    });
  }

  private init() {
    this.initialized.next(true);
  }

  ymaps(): any {
    return ymaps;
  }

}
