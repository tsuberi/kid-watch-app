import {Component, OnInit, OnDestroy} from '@angular/core';
import {Bl} from "../bl/bl";
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

  constructor(private _BL: Bl) {

  }

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

   am_pm_to_hours(time) {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "pm" && hours < 12) hours = hours + 12;
    if (AMPM == "am" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return (sHours +':'+sMinutes);
  }


  private countDown() {

    this.clearTimer();

    this.intervalId = window.setInterval(() => {

      jQuery('#Dummy').click();

    },10000);

    this.intervalId = window.setInterval(() => {

      let t = new Date();
      let c = '';
      let Opening = this._BL._Opening + ":00";
      let Closing = this._BL._Closing + ":00";
      let tempDate = new Date();



      this.message = `${t.toLocaleTimeString().replace('PM', ' ').replace('AM', ' ')} ${t.toLocaleDateString('he-IL')} `;
      this._Date = `${t.toLocaleDateString('he-IL')}`;
      //this._Time = `${t.getHours() + ":" +  t.getMinutes() + ":" +  t.getSeconds()}`;
      this._Time = `${t.getHours() > 10 ? t.getHours() : '0'+t.getHours() }` + ':' +   `${t.getMinutes() > 10 ? t.getMinutes() : '0'+t.getMinutes() }` + ':' +   `${t.getSeconds() > 10 ? t.getSeconds() : '0'+t.getSeconds() }`;

      c  =  `${t.getHours() > 10 ? t.getHours() : '0'+t.getHours() }` + ':' +   `${t.getMinutes() > 10 ? t.getMinutes() : '0'+t.getMinutes() }` + ':' +   `${t.getSeconds() > 10 ? t.getSeconds() : '0'+t.getSeconds() }`


      tempDate.setHours(  parseInt( Opening.substring(0,2)) )
      tempDate.setMinutes( parseInt(Opening.substring(3,5) ))
      tempDate.setHours(tempDate.getHours() -2 )

      Opening  =  `${tempDate.getHours() > 10 ? tempDate.getHours() : '0'+ tempDate.getHours() }` + ':' +   `${tempDate.getMinutes() > 10 ? tempDate.getMinutes() : '0'+ tempDate.getMinutes() }` + ':00'

      tempDate.setHours(  parseInt( Closing.substring(0,2)) )
      tempDate.setMinutes( parseInt(Closing.substring(3,5) ))
      tempDate.setHours(tempDate.getHours()  )

      Closing  =  `${tempDate.getHours() > 10 ? tempDate.getHours() : '0'+ tempDate.getHours() }` + ':' +   `${tempDate.getMinutes() > 10 ? tempDate.getMinutes() : '0'+ tempDate.getMinutes() }` + ':00'

      if (( Opening  < c  ) && ( Closing  > c )){
        this._BL._Kindergarten_Openinig_Toggle = true;
      }
      else
      {
        this._BL._Kindergarten_Openinig_Toggle = false;
      }


    }, 1000);
  }
}
