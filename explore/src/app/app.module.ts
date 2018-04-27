import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { StopwatchComponent } from './stopwatch/stopwatch.component';


@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    StopwatchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
