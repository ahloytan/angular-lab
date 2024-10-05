import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ObservableFormModule } from '../components/observable-form/observable-form.module';
import { RouterOutlet } from '@angular/router';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterOutlet,
        ReactiveFormsModule,
        ObservableFormModule,
    ],
    providers: [],
    bootstrap: [],
    exports: [RouterOutlet]
  })
export class AppModule { }