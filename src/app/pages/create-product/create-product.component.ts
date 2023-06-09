import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { editProductState } from '../home/store/home.reduce';
import { selectEditProductState } from '../home/store/home.select';
import { editProduct } from '../home/store/home.actions';
import { Router } from '@angular/router';
import { selectCategoryState } from '../create-category/Store/category.select';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnDestroy, OnInit {
  background?: string;
  categories = this.store.select(selectCategoryState);
  sub$ = new Subject();
  putBoolean: boolean = true;
  addProduct: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    categoryId: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.editProduct();
  }
  postProduct() {
    
    if (this.putBoolean == true) {
      this.productService
        .postProducts(this.addProduct.value)
        .pipe(takeUntil(this.sub$))
        .subscribe((res) => {
          
          this.router.navigateByUrl('home');
        });
    } else {
      this.putProduct();
    }
  }

  constructor(
    private productService: ProductService,
    private store: Store,
    private router: Router
  ) {}

  editProduct() {
    this.store.pipe(select(selectEditProductState)).subscribe((res) => {
      this.background = res.image;
      this.addProduct = new FormGroup({
        id: new FormControl(res.id),
        name: new FormControl(res.name, Validators.required),
        image: new FormControl(res.image, Validators.required),
        price: new FormControl(res.price, Validators.required),
        description: new FormControl(res.description, Validators.required),
        categoryId: new FormControl(res.category, Validators.required),
      });
      this.putBoolean = false;
    
    });
  }

  putProduct() {
  
    
    this.productService
      .editProduct(this.addProduct.value.id, this.addProduct.value)
      .subscribe((re) => {
       
        this.router.navigateByUrl('home');
        this.store.dispatch(editProduct({ productEditable: [] }));
      });
  }

  ngOnDestroy(): void {
    this.sub$.next(null);
    this.sub$.complete();
  }
}
