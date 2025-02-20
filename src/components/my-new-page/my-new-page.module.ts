import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyNewPageComponent } from './my-new-page.component';



@NgModule({
  declarations: [MyNewPageComponent],
  imports: [
    CommonModule
  ],
  exports: [MyNewPageComponent]
})
export class MyNewPageModule { }
