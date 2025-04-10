import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from './push-notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-push-notification',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './push-notification.component.html',
  styleUrl: './push-notification.component.scss'
})
export class PushNotificationComponent {
  readonly VAPID_PUBLIC_KEY: string = "BG_zMWBGo_wLNFpFiw7zXOeldeXqtcgi7pT-Z-ph4HLFGUckHE9GJIxGT0aN6YoVoIuXEWgYprHDwh7i5622dLs";

  isLoading: boolean = false;
  isSubscribed: boolean = false;
  userId: string = "";
  private _snackBar = inject(MatSnackBar);

  constructor(
    private swPush: SwPush,
    private _pushNotiService: PushNotificationService 
  ) {
    this.swPush.notificationClicks.subscribe((arg) => {
        console.log(
          'Action: ' + arg.action,
          'Notification data: ' + arg.notification.data,
          'Notification data.url: ' + arg.notification.data.url,
          'Notification data.body: ' + arg.notification.body,
        );
        
        if (arg.action === 'explore') {
          window.open("https://ahloytan.netlify.app", '_blank')?.focus();
        }
     });
  }

  subscribeToNotifications(): void {
    this.isLoading = true;
    let snackbarMsg = "You have successfully subscribed to notifications";
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then((sub) => {
      console.log("Notification Subscription: ", sub);
      this._pushNotiService.addPushSubscriber(sub).subscribe({
        next: (data) => {
          this.isSubscribed = true;
          console.log("CHOMIk", data.data[0].uid)
          this.userId = data.data[0].uid;
        },
        error: (err) => console.log('Could not send subscription object to server, reason: ', err)
      })
    })
    .catch(err => {
      let errorMsg = "Could not subscribe to notifications";
      snackbarMsg = errorMsg;
      console.error(errorMsg, err)
    })
    .finally(() => {
      this.isLoading = false;
      this.openSnackBar(snackbarMsg)
    })
  }

  unsubscribeToNotifications(): void {
    let snackbarMsg = "Now you are unsubscribed";
    this.swPush?.unsubscribe();
    if (!this.userId) return;

    this._pushNotiService.deleteSubscriber({userId: this.userId})
    .pipe(finalize(() => {
      this.isSubscribed = false;
      this.openSnackBar(snackbarMsg)
    }))
    .subscribe({
      next: () => {
        
      },
      error: (err: any) => {
        snackbarMsg = "Something went wrong with the unsubscription";
        console.log('Unsubscription failed', err)
      }
    });
  }

  broadcast(): void {
    let snackbarMsg = "Broadcast sent successfully";
    this._pushNotiService.broadcast()
    .pipe(finalize(() => this.openSnackBar(snackbarMsg)))
    .subscribe({
      next: () => {

      },
      error: (err) => {
        snackbarMsg = "Something went wrong with the broadcast";
      }
    });
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3000
    });
  }

  ngOnDestroy() {
    this.unsubscribeToNotifications();
  }
}
