import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, interval, concat } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'web';
  apiData: any;
  private _swPush: SwPush = inject(SwPush)
  private _swUpdate: SwUpdate = inject(SwUpdate)
  private _snackbar: MatSnackBar = inject(MatSnackBar)
  private appRef: ApplicationRef = inject(ApplicationRef)
  private updates: SwUpdate = inject(SwUpdate)
  private readonly httpClient: HttpClient = inject(HttpClient);
  ngOnInit(): void {
    this.dummyCall();
    this.requestSubscription();
    this.setupPeriodicUpdateCheck();
  }

  dummyCall() {
    this.httpClient.get('http://dummy.restapiexample.com/api/v1/employees')
      .pipe(
        map((res: any) => this.apiData = res.data)
      ),
      catchError((err) => { console.error('Error fetching data:', err); throw err; });
  }

  updateClient() {
    console.log("Checking for updates...", 'updateClient');
    if (!this._swUpdate.isEnabled) {
      console.info("Service Worker is not enabled.");
      return;
    }

    this._swUpdate.versionUpdates
        .pipe(
          filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')
        )
        .subscribe(event => {
          console.log(`Current version: ${event.currentVersion.hash}`);
          console.log(`New version ready: ${event.latestVersion.hash}`);
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

    // this._swPush.requestSubscription({
    //   serverPublicKey: '<VAPID_PUBLIC_KEY_FROM_BACKEND>'
    // }).then((_) => {
    //   console.log(JSON.stringify(_));
    // }).catch((_) => console.log);
  }

  setupPeriodicUpdateCheck() {
    console.log("Setting up periodic update checks...");
    this.updateClient()
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const everyThirtyMinutes$ = interval(10000);
    const everyThirtyMinutesOnceAppIsStable$ = concat(appIsStable$, everyThirtyMinutes$);

    everyThirtyMinutesOnceAppIsStable$.subscribe(async () => {
      try {
        this._swUpdate.checkForUpdate();
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });
  }
}
