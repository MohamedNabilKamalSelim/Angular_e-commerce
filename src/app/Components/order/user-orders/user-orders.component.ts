import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IOrder } from 'src/app/Models/iorder';
import { OrdersService } from 'src/app/Services/orders.service';
import { UserAuthService } from 'src/app/Services/user-auth.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit, OnDestroy {
  userEmail: string;
  userOrders!: IOrder[];
  allSubscriptions: Subscription[] = [];

  constructor(private authService: UserAuthService, private ordersService: OrdersService) {
    this.userEmail = this.authService.getUserEmail ? this.authService.getUserEmail : "";
  }

  async ngOnInit(): Promise<void> {
    await this.ordersService.GetAllOrdersByUserEmail(this.userEmail?.toString()).then(orders => {
      this.userOrders = orders
    });

  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.allSubscriptions.length; i++) {
      this.allSubscriptions[i].unsubscribe();
    }
  }

}
