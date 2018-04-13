import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import { Subscriber } from 'rxjs/Subscriber';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css']
})
export class StopwatchComponent implements OnInit {

  timepassed: number = 0;
  display: boolean = false;

  getrid: object = Observable.interval().subscribe;

  startWatch(){
      this.getrid = Observable.interval(1000).subscribe(x => this.timepassed = this.timepassed +1);
  }
  stopWatch(){
    if(this.getrid instanceof Subscriber)
    {
      this.getrid.unsubscribe();
    }
  }
  resetWatch(){
    if(this.getrid instanceof Subscriber)
    {
      this.getrid.unsubscribe();
    }
    this.timepassed = 0;
  }
  constructor() {
   }

  ngOnInit() {
  }
}
