import { BE_ENDPOINT } from '../../environments/environment';
import { Component, inject } from '@angular/core';
import { EventSourceService } from '../../shared/event-source.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  protected reminders: any = [];
  protected remindersForm: any;

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
  
  ngOnInit() {
  }

  submitForm(): void {
    if (this.remindersForm.invalid) {
      this.openSnackBar("Please fill up the necessary fields first!");
      this.markAllControlsTouchedAndDirty(this.remindersForm);
      return;
    }

    const remindersFormRawValues = this.remindersForm.getRawValue();
    const { receiverUserId, message } = remindersFormRawValues;
    if (receiverUserId <= 0) {
      this.openSnackBar("Please enter a sender user id greater than 0");
      return;
    }

    this.sendReminder(this.connectorUserId, receiverUserId, message);
  }

  openConnection(): void {
    if (this.connectorUserId <= 0) {
      this.openSnackBar("Please enter a sender user id greater than 0");
      return;
    }
    
    this.getReminders();
    let url = `${BE_ENDPOINT}/events?connectorUserId=${this.connectorUserId}`;
    const options = { withCredentials: true };
    const eventNames = ['newEvent'];

    this.eventSourceSubscription = this.eventSourceService.connectToServerSentEvents(url, options, eventNames)
    .subscribe({
      next: data => {
          //handle event
        console.log("Event Source Subscription OK", data);
        this.getReminders();
      },
      error: error => {
          //handle error
        console.log("Event Source Subscription ERROR", error);
      }
    });
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

  private async sendReminder(senderUserId: number, receiverUserId: number, message: string): Promise<any> {
    this.isLoading = true;

    let snackbarMsg = 'Reminder sent';
    this._sseService.sendReminders({senderUserId, receiverUserId, message})
    .pipe(finalize(() => this.openSnackBar(snackbarMsg)))
    .subscribe({
      next: (data) => console.log("OK", data),
      error: (err) => {
        snackbarMsg = 'Something went wrong, please contact admin @ahloysius'
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
  
  ngOnDestroy() {
    this.eventSourceSubscription?.unsubscribe();
    this.eventSourceService.close();
  }
}
