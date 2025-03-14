import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SwUpdateService {
  hasUpdate = false;

  constructor(private swUpdate: SwUpdate) {
    // if (this.swUpdate.isEnabled) {
    //   console.log("Service worker is registered!"); 

    //   // Check for updates every 30 seconds
    //   interval(30000).subscribe(() => {
    //     this.swUpdate.checkForUpdate().then(() => {
    //       console.log("Checking for updates every 30s");
    //     });
    //   });
    // }

    // // Listen for version updates
    // this.swUpdate.versionUpdates.subscribe((event) => {
    //   if (event.type === 'VERSION_DETECTED') {
    //     console.log('New version detected!');
    //     this.hasUpdate = true;
    //   }

    //   if (event.type === 'VERSION_READY') {
    //     console.log(event);
    //     console.log('New version is ready, reloading in 5s...');
    //     setTimeout(() => window.location.reload(), 5000);
    //   }
    // });
  }

  reloadSite(): void {
    location.reload();
  }
}
