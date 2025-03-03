import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SwUpdateService } from '../shared/service-worker.service';
import { MyNewPageComponent } from '../components/my-new-page/my-new-page.component';
import { ObservableFormComponent } from '../components/observable-form/observable-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatIconModule, 
    MyNewPageComponent,
    ObservableFormComponent, 
    RouterOutlet, 
    ServiceWorkerModule 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-observables';
  session: any;
  constructor(
    private _router: Router,
    public _swUpdateService: SwUpdateService,
  ) { 

  }


  ngOnInit(): void {   
  }

  goToHome(): void {
    this._router.navigate(['']);
  }

  goToNewPage(): void {
    this._router.navigate(['/my-new-page']);
  }

  goToNewsTablePage(): void {
    this._router.navigate(['/news-table']);
  }
}
