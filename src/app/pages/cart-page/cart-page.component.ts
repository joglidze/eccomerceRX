import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';
import { ProductPost } from 'src/app/core/interfaces/productPost';
import { cartState } from '../home/store/home.select';
import { ProductResponse } from 'src/app/core/interfaces/product';
import { deleteProduct } from './Store/cart.actions';
import { addCart } from '../home/store/home.actions';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartProducts?: ProductResponse[];
  loader:boolean = false;
  successMessage:boolean =false;
  cartSum?: number = 0;
  sub$ = new Subject();
  constructor(private store: Store, private orderService: OrderService) {}

  ngOnInit(): void {
    this.getCartProduct();
  }

  getCartProduct() {
    this.store
      .pipe(select(cartState), takeUntil(this.sub$))
      .subscribe((res) => {
        this.cartProducts = res.addCart;
        

        this.TotalCost();
      });
  }

  deleteCart(productId: string) {
    this.cartProducts = this.cartProducts?.filter((product) => {
      return productId !== product.id;
    });

    this.TotalCost();
    this.store.dispatch(addCart({ cart: this.cartProducts }));

    this.store.dispatch(deleteProduct({ productId }));
  }

  TotalCost() {
    this.cartSum = this.cartProducts?.reduce(
      (acc, item) => acc + item.total,
      0
    );
  }
  ngOnDestroy(): void {
    this.sub$.next(null);
    this.sub$.complete();
  }

  orderIt() {
    this.orderService.orderIt().subscribe((res) => {
     
      this.loader=true;
      
      setTimeout(()=>{
        this.cartProducts  = [];
        this.successMessage=true;
        this.loader=false;
        this.store.dispatch(addCart({ cart: this.cartProducts }));
      },1000)

      
      
    });
  }
}
