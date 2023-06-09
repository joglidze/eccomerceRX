import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { productPageSelect } from '../home/product/store/product.select';
import { ProductResponse } from 'src/app/core/interfaces/product';
import { ProductPost } from 'src/app/core/interfaces/productPost';
import { CartService } from 'src/app/core/services/cart.service';
import { addCart } from '../home/store/home.actions';
import { catchError, takeUntil, tap } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { ActivatedRoute, Route } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit {
  product: any;
  quantity?: string ;
  ngOnInit(): void {
    this.getProduct();
  }

  constructor(
    private store: Store,
    private cartService: CartService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private nzMessage: NzMessageService
  ) {}

  getProduct() {
    this.store.pipe(select(productPageSelect)).subscribe((res) => {
      this.product = res;
    });

    if (JSON.stringify(this.product) === JSON.stringify({})) {
      this.productService
        .getProductById(this.route.snapshot.params['id'])
        .subscribe((res) => {
          this.product = res;
        });
    }
  }

  addCart(product: any, quantity?: string) {
    console.log(typeof quantity);
    this.cartService
      .cartPost({
        productId: product.id,
        quantity: quantity,
      })
      .pipe(
        catchError((error: any) => {
          this.nzMessage.create('error', `Please Authorize`);
          return error;
        })
      )
      .subscribe((res) => {
        this.getCartProducts();
        this.nzMessage.create('success', `Item added to cart`);
      });
  }
  getCartProducts() {
    this.cartService
      .getCartProduct()
      .pipe()
      .subscribe((res) => {
        this.store.dispatch(addCart({ cart: res }));
      });
  }
}
