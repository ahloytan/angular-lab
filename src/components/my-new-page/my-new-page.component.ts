import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-new-page',
  templateUrl: './my-new-page.component.html',
  styleUrl: './my-new-page.component.scss',
  imports: [CommonModule],
  standalone: true
})
export class MyNewPageComponent {

}
