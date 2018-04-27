import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SimpleChanges } from '@angular/core';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import { Subscriber } from 'rxjs/Subscriber';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  timertime: number = 0;
  display: boolean = false;
  getrid: object = null;

  startTimer(){
    if ( this.timertime>0 && !this.display ){
      this.display = true;
      this.getrid = Observable.interval(1000).take(this.timertime).subscribe(x => this.timertime = this.timertime -1 );
    }
  }
  stopTimer(){
    this.display = false;
    if(this.getrid instanceof Subscriber)
    {
      this.getrid.unsubscribe();
    }
  }
  resetTimer(){
    this.display = false;
  }
  constructor() {
  }
  ngOnChanges(changes: SimpleChanges){
    if(this.timertime == 0)
    {
      this.display = false;
    }  
  }
  ngOnInit() {
  }

}
