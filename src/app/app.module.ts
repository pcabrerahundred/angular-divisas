import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CambioComponent } from './components/cambio/cambio.component';
import { ApiService } from './shared/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CambioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
