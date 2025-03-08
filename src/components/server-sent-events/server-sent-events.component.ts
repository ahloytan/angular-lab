import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ServerSentEventsService } from './server-sent-events.service';
import { EventSourceService } from '../../shared/event-source.service';
import { SubscriptionLike } from 'rxjs';
import { BE_ENDPOINT } from '../../environments/environment';

@Component({
  selector: 'app-server-sent-events',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './server-sent-events.component.html',
  styleUrl: './server-sent-events.component.scss'
})
export class ServerSentEventsComponent {
  private readonly eventSourceSubscription: SubscriptionLike;

  protected isLoading: boolean = false;
  protected userId: string = "";

  constructor(
    private eventSourceService: EventSourceService,
    private _sseService: ServerSentEventsService

  ) {

    let url = `${BE_ENDPOINT}/events?userId=${this.userId}`;
    const options = { withCredentials: true };
    const eventNames = ['newEvent'];

    this.eventSourceSubscription = this.eventSourceService.connectToServerSentEvents(url, options, eventNames)
    .subscribe({
      next: data => {
          //handle event
          console.log("CHOMIK OK", data);
      },
      error: error => {
          //handle error
          console.log("CHOMIK NOT OK", error);
      }
    });
  }

  
  sendReminder(): void {
    this.addNews();
  }

  private async addNews(): Promise<any> {
    this.isLoading = true;
    this._sseService.sendReminders({userId: this.userId}).subscribe({
      next: (data) => console.log("OK", data),
      error: (err) => console.log("ERROR", err)
    });
    
    this.isLoading = false;
  }

  
  ngOnDestroy() {
    this.eventSourceSubscription.unsubscribe();
    this.eventSourceService.close();
  }
}
