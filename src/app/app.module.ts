import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';
import { CursorDialogDirective } from './directives/cursor.dialog.directive';
import { ColorService } from './services/color.service';
import { HsvColorService } from './services/hsl.color.service';

@NgModule({
  declarations: [
    AppComponent,
    CursorDialogDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
  ],
  providers: [
    ColorService,
    HsvColorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
