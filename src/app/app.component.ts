import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ObservableFormComponent } from '../components/observable-form/observable-form.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatButtonModule } from '@angular/material/button';
import { swUpdateService } from '../shared/service-worker.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ObservableFormComponent, ServiceWorkerModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-observables';

  constructor(
    private _router: Router,
    public _swUpdateService: swUpdateService
  ) {
  }

  ngOnInit(): void {   
  }

  goToNewPage(): void {
    this._router.navigate(['/my-new-page']);
  }
}
