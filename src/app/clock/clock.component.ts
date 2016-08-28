import {Component, OnInit, OnDestroy} from '@angular/core';
declare var jQuery;

@Component({
  selector: 'my-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {

  intervalId = 0;
  message = '';
  _Time = '';
  _Date = '';


  clearTimer() {
    clearInterval(this.intervalId);
  }

  ngOnInit() {
    this.start();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  start() {
    this.countDown();
  }

  stop() {
    this.clearTimer();
  }

  private countDown() {

    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      let t = new Date();

      this.message = `${t.toLocaleTimeString().replace('PM', ' ').replace('AM', ' ')} ${t.toLocaleDateString('he-IL')} `;
      this._Date = `${t.toLocaleDateString('he-IL')} `;
      this._Time = `${t.toLocaleTimeString().substr(0, 8)}`;

    }, 1000);
  }
}
