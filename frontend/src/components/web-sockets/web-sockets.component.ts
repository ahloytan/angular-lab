import { BE_ENDPOINT_WS } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConnectionStatus, WebSocketMessage, WebSocketService } from '../../shared/web-sockets.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-web-sockets',
  templateUrl: './web-sockets.component.html',
  styleUrl: './web-sockets.component.scss',
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  standalone: true
})
export class WebSocketsComponent {
  readonly ConnectionStatus = ConnectionStatus;
  protected connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  protected messageLog: Array<{
    direction: 'incoming' | 'outgoing';
    timestamp: Date;
    message: WebSocketMessage;
  }> = [];
  protected messageForm: any;
  protected lastSubmittedTime: number = 0;

  private _snackBar = inject(MatSnackBar);
  private statusSubscription: Subscription | null = null;
  private messagesSubscription: Subscription | null = null;

  constructor(
    private wsService: WebSocketService, 
    private _fb: FormBuilder
  ) {
    this.messageForm = this._fb.group({
      name: [null, [Validators.required]],
      message: [null, [Validators.required]]
    })      
  }

  ngOnInit() {
    this.statusSubscription = this.wsService.status$.subscribe(status => {
      this.connectionStatus = status;
    });

    this.messagesSubscription = this.wsService.messages$.subscribe(message => {
      this.logMessage('incoming', message);
    });
  }

  openWebSocket(): void {    
    if (this.messageForm.get('name').hasError('required')) {
      this.openSnackBar("Please fill up name first!");
      return;
    } 

    this.wsService.connect(BE_ENDPOINT_WS);
    this.openSnackBar("Establishing web socket connection...");
  }

  disconnect(): void {
    this.wsService.disconnect();
  }

  sendMessage(): void {
    if (this.messageForm.invalid) {
      this.openSnackBar("Please enter a message!");
      return;
    }

    const isUserSpamming = this.isSpammed(this.lastSubmittedTime, 2500);
    if (isUserSpamming) {
      this.openSnackBar("Chill leh don't spam, wait 2.5s");
      return;
    }
    this.lastSubmittedTime = Date.now();

    const messageFormRawValues = this.messageForm.getRawValue();
    this.wsService.send({type: 'broadcast', ...messageFormRawValues});
    // this.logMessage('outgoing', messageFormRawValues);
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3000
    });
  }

  private logMessage(direction: 'incoming' | 'outgoing', message: WebSocketMessage): void {
    console.log(message);
    this.messageLog.unshift({
      direction,
      timestamp: new Date(),
      message
    });
    
    // Limit log size to prevent memory issues
    if (this.messageLog.length > 100) {
      this.messageLog.pop();
    }
  }

  private isSpammed(field: any, milliseconds: number): boolean {
    return (Date.now() - field) < milliseconds;
  }

  ngOnDestroy(): void {
    this.disconnect();
    
    this.statusSubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
  }
}
