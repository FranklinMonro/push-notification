import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { filter, interval, concat } from 'rxjs';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationRef } from '@angular/core';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'web';

  private _swPush: SwPush = inject(SwPush)
  private _swUpdate: SwUpdate = inject(SwUpdate)
  private _snackbar: MatSnackBar = inject(MatSnackBar)
  private appRef: ApplicationRef = inject(ApplicationRef)
  private updates: SwUpdate = inject(SwUpdate)

  ngOnInit(): void {
    this.requestSubscription();
    this.setupPeriodicUpdateCheck();
    // this.checkForUpdates();
  }

  checkForUpdates() {
    this._swUpdate.versionUpdates
      .pipe(filter(evt => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        const snackBarRef = this._snackbar.open('A new version is available.', 'Reload');
        snackBarRef.onAction().subscribe(() => {
          this._swUpdate.activateUpdate().then(() => document.location.reload());
        });
      });
  }

  requestSubscription() {
    if (!this._swPush.isEnabled) {
      console.log("Notification is not enabled.");
      return;
    }

    this._swPush.requestSubscription({
      serverPublicKey: '<VAPID_PUBLIC_KEY_FROM_BACKEND>'
    }).then((_) => {
      console.log(JSON.stringify(_));
    }).catch((_) => console.log);
  }

  setupPeriodicUpdateCheck() {
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const everyThirtyMinutes$ = interval(30 * 60 * 1000);
    const everyThirtyMinutesOnceAppIsStable$ = concat(appIsStable$, everyThirtyMinutes$);

    everyThirtyMinutesOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this._swUpdate.checkForUpdate();
        if (updateFound) {
          this.checkForUpdates();
        }
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });
  }
}
