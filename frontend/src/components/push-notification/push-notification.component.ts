import { Component, HostListener, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from './push-notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { SwUpdateService } from '../../shared/service-worker.service';

@Component({
  selector: 'app-push-notification',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './push-notification.component.html',
  styleUrl: './push-notification.component.scss'
})
export class PushNotificationComponent {
  readonly VAPID_PUBLIC_KEY: string = "BG_zMWBGo_wLNFpFiw7zXOeldeXqtcgi7pT-Z-ph4HLFGUckHE9GJIxGT0aN6YoVoIuXEWgYprHDwh7i5622dLs";

  isLoading: boolean = false;
  isSubscribed: boolean = false;
  isServiceWorkerDisabled: boolean = false;
  notifications: number | undefined = 15;
  userId: string | null = null;
  private _snackBar = inject(MatSnackBar);

  constructor(
    private swPush: SwPush,
    public _swUpdateService: SwUpdateService,
    private _pushNotiService: PushNotificationService 
  ) {
    this.swPush.notificationClicks.subscribe((arg) => {
        console.log(
          arg,
          'Action: ' + arg.action,
          'Notification data: ' + arg.notification.data,
          'Notification data.url: ' + arg.notification.data.url,
          'Notification data.body: ' + arg.notification.body,
        );
        
        if (arg.action === 'explore' || arg.action === 'default') {
          window.open("https://ahloytan.netlify.app", '_blank')?.focus();
        }
     });

     /** https://stackoverflow.com/questions/54138763/open-pwa-when-clicking-on-push-notification-handled-by-service-worker-ng7-andr **/
     /** https://angular.dev/ecosystem/service-workers/push-notifications **/
     /** https://web.dev/articles/push-notifications-web-push-protocol **/
     this.swPush.messages.subscribe((messages: any) => {
          const badgeCount = messages.notification?.badgeCount;
          
          if(badgeCount || 'setAppBadge' in navigator) {
            this.notifications = badgeCount;
            (navigator as any).setAppBadge(badgeCount);
          }
        }
      )
  }

  async ngOnInit() {
    /** https://push.foo/ **/
    this.isServiceWorkerDisabled = !this._swUpdateService.isEnabled();
    this.openSnackBar("INITED");
    if (!this.userId) {
      this.notifications = 0;
      (navigator as any).setAppBadge(0);
    }
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
          this.userId = data.data[0].uid;
        },
        error: (err) => console.log('Could not send subscription object to server, reason: ', err)
      })
    })
    .catch(err => {
      let errorMsg = "Could not subscribe to notifications. Note: if you are on mobile, you have to add the app as a shortcut 'Add to Home Screen' for it to work. Contact @ahloysius for any clarifications!";
      snackbarMsg = errorMsg;
      console.error(errorMsg, err);
    })
    .finally(() => {
      this.isLoading = false;
      this.openSnackBar(snackbarMsg);
    })
  }

  /** https://web.dev/articles/push-notifications-common-issues-and-reporting-bugs#http_status_codes **/
  /** https://stackoverflow.com/questions/76071108/angular-and-navigator-setappbadge **/
  unsubscribeToNotifications(): void {
    this.isSubscribed = false;
    let snackbarMsg = "Now you are unsubscribed";
    this.swPush?.unsubscribe();
    if (!this.userId) return;

    this._pushNotiService.deleteSubscriber({userId: this.userId})
    .pipe(finalize(() => {
      this.userId = null;
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
    this._pushNotiService.broadcast({userId: this.userId})
    .pipe(finalize(() => this.openSnackBar(snackbarMsg)))
    .subscribe({
      next: () => {

      },
      error: (err) => {
        snackbarMsg = "Something went wrong with the broadcast";
      }
    });
  }

  clearAppBadge(): void {
    if (navigator.clearAppBadge) {
      navigator.clearAppBadge();
      this.notifications = undefined;
    }
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3000
    });
  }

  // ngOnDestroy() {
  //   this.unsubscribeToNotifications();
  // }

  @HostListener('window:beforeunload')
  onDestroy() {
    this.unsubscribeToNotifications();
  }
}
