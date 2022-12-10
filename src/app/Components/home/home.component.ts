import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, map, Subscription } from 'rxjs';
import { PromotionAdsService } from 'src/app/Services/promotion-ads.service';
import { StoreData } from 'src/app/ViewModels/store-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  storeInfo: StoreData;
  isImageShown = true;
  subscription!: Subscription;
  AllSubscriptions: Subscription[] = [];
  constructor(private adsService: PromotionAdsService) {
    this.storeInfo = new StoreData('Nabil', 'https://picsum.photos/350/200', [
      'Cairo',
      'Alex',
      'Sharqia',
    ]);
  }

  ngOnInit(): void {
    // this.subscription = this.adsService.GeyAllAds(2).subscribe({
    //   next: (data) => {
    //     console.log(data);

    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    //   complete: () => {
    //     console.log("Ads list completed successfully/!");
    //   }
    // });

    // this.AllSubscriptions.push(this.subscription);

    // Using build-in methods to create observable
    // this.AllSubscriptions.push(this.adsService.GetSerialAds().subscribe({
    //   next: (ads) => console.log(ads),
    //   complete: () => console.log("compppppppplllllll")
    // }));

    // Using filter in pipe with observable

    let observer = {
      next: (data: string) => {
        alert(data);

      },
      error: (err: string) => {
        alert(err);
      },
      complete: () => {
        alert("Ads list completed successfully..!");
      }
    }
    let subscription = this.adsService.GetAllAds(2).pipe(
      filter(ad => ad.includes("cup")),
      map(ad => "ad: " + ad)
    );

    this.AllSubscriptions.push(subscription.subscribe(observer));

  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.AllSubscriptions.length; i++) {
      this.AllSubscriptions[i].unsubscribe();
    }
  }

  ToggleImage() {
    this.isImageShown = !this.isImageShown;
  }
}
