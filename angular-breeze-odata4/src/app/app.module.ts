import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BreezeBridgeAngularModule } from 'breeze-bridge-angular';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpModule,
    BreezeBridgeAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
