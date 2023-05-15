import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ProductComponent } from './product/product.component';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { HeaderModule } from '../header/header.module';
import { StoreModule } from '@ngrx/store';
import {
  cartFeaturekey,
  cartReducer,
  dropDownKey,
  dropDownReducer,
  editStateReduce,
  editableKey,
  homeFeaturekey,
  homeReducer,
} from './store/home.reduce';
import { RouterModule } from '@angular/router';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { EffectsModule } from '@ngrx/effects';
import { CartPageEffect } from '../cart-page/Store/cart.effects';
import { HelpingSectionComponent } from './helping-section/helping-section.component';

@NgModule({
  declarations: [HomeComponent, CarouselComponent, ProductComponent, HelpingSectionComponent],
  imports: [
    FormsModule,
    CommonModule,
    
    RouterModule,
    NzIconModule,
    NzCarouselModule,
    HeaderModule,
    NzCardModule,

    EffectsModule.forFeature([CartPageEffect]),
    StoreModule.forFeature(homeFeaturekey, homeReducer),
    StoreModule.forFeature(cartFeaturekey, cartReducer),
    StoreModule.forFeature(dropDownKey, dropDownReducer),
    StoreModule.forFeature(editableKey, editStateReduce),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports: [HomeComponent],
})
export class HomeModule {}
