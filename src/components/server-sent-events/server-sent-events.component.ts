import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ServerSentEventsService } from './server-sent-events.service';
import { EventSourceService } from '../../shared/event-source.service';
import { BE_ENDPOINT } from '../../environments/environment';

@Component({
  selector: 'app-server-sent-events',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './server-sent-events.component.html',
  styleUrl: './server-sent-events.component.scss'
})
export class ServerSentEventsComponent {
  protected eventSourceSubscription: any;
  protected isLoading: boolean = false;
  protected remindersForm: any;
  protected senderUserId: number = 1;

  constructor(
    private _sseService: ServerSentEventsService,
    private eventSourceService: EventSourceService,
    private _fb: FormBuilder
  ) {
    this.remindersForm = this._fb.group({
      receiverUserId: [null, [Validators.required]],
      message: [null, [Validators.required]]
    });
  }

  
  submitForm(): void {
    if (this.remindersForm.invalid) {
      this.markAllControlsTouchedAndDirty(this.remindersForm);
      return;
    }

    const remindersFormRawValues = this.remindersForm.getRawValue();
    const { receiverUserId, message } = remindersFormRawValues;
    if (receiverUserId <= 0) {
      alert("Please enter a sender user id greater than 0");
      return;
    }

    this.sendReminder(this.senderUserId, receiverUserId, message);
  }

  openConnection(): void {
    if (this.senderUserId <= 0) {
      alert("Please enter a sender user id greater than 0");
      return;
    }

    let url = `${BE_ENDPOINT}/events?senderUserId=${this.senderUserId}`;
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

  private async sendReminder(senderUserId: number, receiverUserId: number, message: string): Promise<any> {
    this.isLoading = true;
    this._sseService.sendReminders({senderUserId, receiverUserId, message}).subscribe({
      next: (data) => console.log("OK", data),
      error: (err) => console.log("ERROR", err)
    });
    
    this.isLoading = false;
  }

  private markAllControlsTouchedAndDirty(formGroup: any): void {
    Object.values(formGroup.controls).forEach((control: any) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllControlsTouchedAndDirty(control); // Recursive call for nested groups
      } else {
        control.markAsDirty();
        control.markAsTouched();
      }
    });
  }
  
  ngOnDestroy() {
    this.eventSourceSubscription?.unsubscribe();
    this.eventSourceService.close();
  }
}
