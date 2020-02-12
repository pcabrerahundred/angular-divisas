import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CambioComponent } from './components/cambio/cambio.component';
import { ApiService } from './shared/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe} from '@angular/common';
import { NumberDirectiveDirective } from './directives/number-directive.directive';

@NgModule({
  declarations: [
    AppComponent,
    CambioComponent,
    NumberDirectiveDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [ApiService, CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
