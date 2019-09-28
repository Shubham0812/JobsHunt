import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalScrollComponent } from './horizontal-scroll.component';

import {
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule
} from "@angular/material";


@NgModule({
  declarations: [HorizontalScrollComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ], exports: [
    HorizontalScrollComponent
  ]
})
export class HorizontalScrollModule {}
