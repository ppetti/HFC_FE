import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.isLoading.asObservable().pipe(delay(1));

  constructor() { }

  show(){
    this.isLoading.next(true);
  }

  hide(){
    this.isLoading.next(false);
  }

  // public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // constructor() { }
}
