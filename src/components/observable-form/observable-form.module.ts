import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ObservableFormComponent } from './observable-form.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    declarations: [
        ObservableFormComponent
    ],
    imports: [
      ReactiveFormsModule,
      MatSlideToggleModule
    ],
    providers: [],
    bootstrap: [],
    exports: [
      ObservableFormComponent, 
      ReactiveFormsModule
    ]
  })
export class ObservableFormModule { }