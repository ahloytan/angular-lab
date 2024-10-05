import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ObservableFormComponent } from './observable-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        ObservableFormComponent
    ],
    imports: [
      ReactiveFormsModule,
      MatFormFieldModule, 
      MatInputModule, 
      MatSelectModule,
      MatButtonModule
    ],
    providers: [],
    bootstrap: [],
    exports: [
      ObservableFormComponent, 
      ReactiveFormsModule
    ]
  })
export class ObservableFormModule { }