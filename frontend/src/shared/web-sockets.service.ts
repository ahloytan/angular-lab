import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retry, takeUntil } from 'rxjs/operators';

export enum ConnectionStatus {
  CONNECTING = 'Connecting',
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected'
}

export interface WebSocketMessage {
  type: string;
  payload: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<WebSocketMessage> | null = null;
  private messagesSubject = new Subject<WebSocketMessage>();
  private stopReconnect = new Subject<void>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private initialReconnectInterval = 1000;
  private connectionStatus$ = new BehaviorSubject<ConnectionStatus>(ConnectionStatus.DISCONNECTED);

  public messages$ = this.messagesSubject.asObservable();
  public status$ = this.connectionStatus$.asObservable();

  constructor() {}

  connect(url: string): void {
    if (this.socket$ !== null) {
      this.socket$.complete();
    }

    this.connectionStatus$.next(ConnectionStatus.CONNECTING);
    this.socket$ = this.createWebSocket(url);
    
    this.socket$.pipe(
      retry({
        count: this.maxReconnectAttempts,
        delay: (error, retryCount) => {
          this.reconnectAttempts = retryCount;
          const reconnectInterval = this.initialReconnectInterval * Math.pow(2, retryCount);
          console.log(`WebSocket reconnecting in ${reconnectInterval}ms (attempt ${retryCount})`);
          return timer(reconnectInterval);
        }
      }),
      takeUntil(this.stopReconnect)
    ).subscribe({
      next: (message) => {
        this.messagesSubject.next(message);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
        this.connectionStatus$.next(ConnectionStatus.DISCONNECTED);
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('Maximum reconnection attempts reached');
        }
      },
      complete: () => {
        console.log('WebSocket connection closed');
        this.connectionStatus$.next(ConnectionStatus.DISCONNECTED);
      }
    });
  }

  send(message: WebSocketMessage): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(message);
    } else {
      console.error('Cannot send message - WebSocket is not connected');
    }
  }

  disconnect(): void {
    this.stopReconnect.next();
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    this.connectionStatus$.next(ConnectionStatus.DISCONNECTED);
  }

  private createWebSocket(url: string): WebSocketSubject<WebSocketMessage> {
    return webSocket<WebSocketMessage>({
      url,
      openObserver: {
        next: () => {
          console.log('WebSocket connection established');
          this.connectionStatus$.next(ConnectionStatus.CONNECTED);
          this.reconnectAttempts = 0;
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket connection closed closeObserver');
          this.connectionStatus$.next(ConnectionStatus.DISCONNECTED);
        },
      }
    });
  }
}