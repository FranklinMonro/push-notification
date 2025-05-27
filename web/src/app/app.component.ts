import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwPush } from '@angular/service-worker';

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

  ngOnInit(): void {
    this.requestSubscription();
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
}
