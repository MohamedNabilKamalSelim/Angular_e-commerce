import { Injectable, OnInit } from '@angular/core';
import { from, interval, observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionAdsService {
  private adsList: string[];
  constructor() {
    this.adsList = [
      "Euro cup",
      "Shoose",
      "World cup",
      "Oil Gas",
      "Champion cup",
      //"",
      "Affrica cup",
      "Don't bye this",

    ];
  }

  GetAllAds(timeInSeconds: number): Observable<string> {
    let count = 0;
    return new Observable<string>((observer) => {
      setInterval(() => {
        if (count == this.adsList.length) {
          observer.complete();
        }
        if (this.adsList[count] == "") {
          observer.error("Error Message")
        }
        observer.next(this.adsList[count++]);
      }, timeInSeconds * 10000);
      return {
        unsubscribe() { }
      }
    });
  }

  GetSerialAds(): Observable<string> {
    return from(this.adsList);
  }

}
