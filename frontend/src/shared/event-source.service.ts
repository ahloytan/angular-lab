import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class EventSourceService {
  private eventNames: string[] = [];
  private eventSource: any;
  private options: any;
  private reconnectFrequencySec: number = 1000;
  private reconnectTimeout: any;
  private SSE_RECONNECT_UPPER_LIMIT: number = 64;
  private subscriber: Subscriber<Event> | null = null;
  private url: string = "";
  /**
  * constructor
  * @param zone - we need to use zone while working with server-sent events
  * because it's an asynchronous operations which are run outside of change detection scope
  * and we need to notify Angular about changes related to SSE events
  */
  constructor(private zone: NgZone) {}

  /**
  * Method for creation of the EventSource instance
  * @param url - SSE server api path
  * @param options - configuration object for SSE
  */
  getEventSource(url: string, options: EventSourceInit): EventSource {
    return new EventSource(url, options);
  }

  /**
  * Method for establishing connection and subscribing to events from SSE
  * @param url - SSE server api path
  * @param options - configuration object for SSE
  * @param eventNames - all event names except error (listens by default) you want to listen to
  */
  connectToServerSentEvents(url: string, options: EventSourceInit, eventNames: string[] = []): Observable<Event> {
    this.eventNames = eventNames;
    this.url = url;
    this.options = options;
    return new Observable((subscriber: Subscriber<Event>) => {
      this.subscriber = subscriber;
      this.createSseEventSource();
    });
  }

  close(): void {
    if (!this.eventSource) return;
    
    this.eventSource.close();
    this.eventSource = null;
  }
   
  private reconnectOnError(): void {
    const self = this;
    this.close();
    clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => {
      self.createSseEventSource();
      self.reconnectFrequencySec *= 2;
      if (self.reconnectFrequencySec >= this.SSE_RECONNECT_UPPER_LIMIT) {
        self.reconnectFrequencySec = this.SSE_RECONNECT_UPPER_LIMIT;
      }
    }, this.reconnectFrequencySec * 1000);
  }
  
  createSseEventSource(): void {
    this.close();
    this.eventSource = this.getEventSource(this.url, this.options);

    this.eventSource.onerror = (error: any) => {
        console.log("Vercel API timeout limit of 30s has been reached. Will proceed to reconnect now!", error);
        this.reconnectOnError();
        // this.zone.run(() => subscriber.error(error));
    };
    this.eventSource.onopen = () => {
        this.reconnectFrequencySec = 1;
        console.log("SSE connection established");
    };
    this.eventSource.onmessage = (event: MessageEvent) => console.log("MESSAGE RECEIVED", event);

    this.eventSource.addEventListener('error', (err: any) => console.log(`${err.eventPhase === EventSource.CLOSED ? "SSE connection closed" : "Error: " + err}`));
    
    this.eventNames.forEach((event: string) => {
        this.eventSource.addEventListener(event, (data: any) => {
          this.zone.run(() => this.subscriber?.next(data));
        });
    });
  }
}