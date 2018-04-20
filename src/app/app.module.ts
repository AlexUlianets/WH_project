import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { FormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { CursorDialogDirective } from './directives/cursor.dialog.directive';
import { ColorService } from './services/color.service';
import { HsvColorService } from './services/hsl.color.service';
import { RgbColorService } from "./services/rgb.color.service";
import { MapDataHttpService } from './services/http/map.data.http.service';

import { FacebookModule } from 'ngx-facebook';


@NgModule({
  declarations: [
    AppComponent,
    CursorDialogDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    CalendarModule,
    FacebookModule.forRoot()
  ],
  providers: [
    ColorService,
    HsvColorService,
    RgbColorService,
    MapDataHttpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
