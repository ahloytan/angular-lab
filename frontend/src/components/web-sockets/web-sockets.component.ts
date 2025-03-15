import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { WebSocketService } from '../../shared/web-sockets.service';
import { MatButtonModule } from '@angular/material/button';
import { BE_ENDPOINT_WS } from '../../environments/environment';

@Component({
  selector: 'app-web-sockets',
  templateUrl: './web-sockets.component.html',
  styleUrl: './web-sockets.component.scss',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  standalone: true
})
export class WebSocketsComponent {

  constructor(private wsService: WebSocketService) {

  }

  openWebSocket(): void {    
    this.wsService.connect(BE_ENDPOINT_WS);
  }
}
