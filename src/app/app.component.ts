import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SwUpdateService } from '../shared/service-worker.service';
import { MyNewPageComponent } from '../components/my-new-page/my-new-page.component';
import { ObservableFormComponent } from '../components/observable-form/observable-form.component';
import { routesName } from './app.routes';

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
  links = [
    {
      title: 'Home',
      route: routesName.HOME,
      icon: 'home'
    },
    {
      title: 'News Table Page',
      route: routesName.NEWS,
      icon: 'table_chart'
    },
    {
      title: 'Server Sent Events',
      route: routesName.SSE,
      icon: 'note_add'
    },
    {
      title: 'New Page',
      route: routesName.NEW_PAGE,
      icon: 'note_add'
    },
  ];

  //https://jossef.github.io/material-design-icons-iconfont/
  constructor(
    private _router: Router,
    public _swUpdateService: SwUpdateService,
  ) { 

  }


  ngOnInit(): void {   
  }

  goToRoute(route: string): void {
    this._router.navigate([`/${route}`]);
  }

  destroyServiceWorker() {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
          registration.unregister();
      } 
    });
  }

  ngOnDestroy() {
    console.log("CHOMIK DESTROY");
  }
}
