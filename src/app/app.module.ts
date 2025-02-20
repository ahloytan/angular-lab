import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterOutlet,
        ReactiveFormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          registrationStrategy: 'registerWhenStable:30000'
        })
    ],
    providers: [],
    bootstrap: [],
    exports: [RouterOutlet]
  })
export class AppModule { }