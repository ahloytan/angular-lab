import { BE_ENDPOINT } from '../../environments/environment';
import { Component, inject } from '@angular/core';
import { EventSourceService } from '../../shared/event-source.service';
import { AbstractControlOptions, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ServerSentEventsService } from './server-sent-events.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-server-sent-events',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatTableModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './server-sent-events.component.html',
  styleUrl: './server-sent-events.component.scss'
})

export class ServerSentEventsComponent {
  private _snackBar = inject(MatSnackBar);
  
  protected connectorUserId: number = 1;
  protected displayedColumns: string[] = ['id', 'sender_user_id', 'message', 'created_at'];
  protected eventSourceSubscription: any;
  protected isLoading: boolean = false;
  protected lastOpenedConnectionTime: number = 0;
  protected lastSubmittedTime: number = 0;
  protected reminders: any = [];
  protected remindersForm: any;

  constructor(
    private _sseService: ServerSentEventsService,
    private eventSourceService: EventSourceService,
    private _fb: FormBuilder
  ) {
    this.remindersForm = this._fb.group({
      receiverUserId: [1, [Validators.required, Validators.min(1)]],
      message: [null, [Validators.required]]
    }, { validators: this.parentValidator } as AbstractControlOptions);
  }
  
  ngOnInit() {
    this.connectorUserId = Math.floor(Math.random() * 9999) + 1;
  }

  onSendReminder(): void {
    if (this.remindersForm.invalid) {
      this.checkError();
      this.markAllControlsTouchedAndDirty(this.remindersForm);
      return;
    }

    const isUserSpamming = this.isSpammed(this.lastSubmittedTime, 2500);
    if (isUserSpamming) {
      this.openSnackBar("Chill leh don't spam, wait 2.5s");
      return;
    }
    this.lastSubmittedTime = Date.now();

    this.sendReminder();
  }

  openConnection(): void {
    if (this.connectorUserId <= 0) {
      this.openSnackBar("Please enter a sender user id greater than 0");
      return;
    }

    const isUserSpamming = this.isSpammed(this.lastOpenedConnectionTime, 5000);
    if (isUserSpamming) {
      this.openSnackBar("Chill leh don't spam, wait 5s");
      return;
    }
    this.lastOpenedConnectionTime = Date.now();

    this.getReminders();
    let url = `${BE_ENDPOINT}/open-stream/user/${this.connectorUserId}`;
    const options = { withCredentials: true };
    const eventNames = ['NEW_MESSAGE_EVENT', 'OPEN_STREAM_EVENT'];

    this.openSnackBar(`Successfully connected as user id ${this.connectorUserId}`);
    this.eventSourceSubscription = this.eventSourceService.connectToServerSentEvents(url, options, eventNames)
    .subscribe({
      next: (data: any) => {
        if (!data) {
          console.log("NO DATA FROM EVENT STREAM");
          return;
        }

        this.eventNamesLogger(data.type);
        if (data.type === 'NEW_MESSAGE_EVENT') {
          const reminder = JSON.parse(data.data);
          this.reminders = [reminder, ...this.reminders];
        }
      },
      error: error => {
      }
    });
  }

  closeConnection(): void {
    this.ngOnDestroy();
    this.eventSourceSubscription = null;
    this.openSnackBar(`Successfully closed connection as user id ${this.connectorUserId}`);
  }

  private eventNamesLogger(eventName: string) {
    if (eventName === "OPEN_STREAM_EVENT") {
      console.log("Event source subscription - OPEN_STREAM_EVENT");
      return;
    }

    console.log("Event source subscription - NEW_MESSAGE_EVENT");
  }

  private getReminders(): void {
    this._sseService.getReminders(this.connectorUserId).subscribe({
      next: (data) => {
        if (data?.length) this.reminders = data; 
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private async sendReminder(): Promise<any> {
    const remindersFormRawValues = this.remindersForm.getRawValue();
    const { receiverUserId, message } = remindersFormRawValues;
    this.isLoading = true;

    let snackbarMsg = 'Reminder sent';
    this._sseService.sendReminders({senderUserId: this.connectorUserId, receiverUserId, message})
    .pipe(finalize(() => this.openSnackBar(snackbarMsg)))
    .subscribe({
      next: (data) => console.log("OK", data),
      error: (err) => {
        snackbarMsg = 'Something went wrong, please contact admin @ahloysius via Telegram'
        console.log("ERROR", err);
      }
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

  private openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3000
    });
  }

  private isSpammed(field: any, milliseconds: number): boolean {
    return (Date.now() - field) < milliseconds;
  }

  private checkError(): void {
    if (this.remindersForm.hasError('required')) {
      this.openSnackBar("Please fill up the necessary fields first!");
      return;
    } 
    
    if (this.remindersForm.get('receiverUserId').hasError('min')) {
      this.openSnackBar("Please enter a sender user id greater than 0");
      return;
    }
  }
  
  private parentValidator(formGroup: FormGroup) {
    const field1 = formGroup.get('receiverUserId')?.value;
    const field2 = formGroup.get('message')?.value;
  
    if (!field1 || !field2) return { required: true };
    
    return null;
  }

  ngOnDestroy() {
    this.eventSourceSubscription?.unsubscribe();
    this.eventSourceService.close();
  }
}