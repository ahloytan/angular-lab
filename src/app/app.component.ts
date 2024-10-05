import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ObservableFormModule } from '../components/observable-form/observable-form.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ObservableFormModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-observables';
}
