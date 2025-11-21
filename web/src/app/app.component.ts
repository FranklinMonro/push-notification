import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'web';

  private _swPush: SwPush = inject(SwPush)
  private _swUpdate: SwUpdate = inject(SwUpdate)
  ngOnInit(): void {
    this.requestSubscription();
  }

  checkForUpdates() {
    this._swUpdate.versionUpdates
      .pipe(filter(evt => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        console.log('A new version is available. Reload the page to update.');
        // this._swUpdate.activateUpdate().then(() => document.location.reload());
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
}
