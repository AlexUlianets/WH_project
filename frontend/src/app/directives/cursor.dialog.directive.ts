import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import * as $ from 'jquery';

@Directive({ selector: '[wth-cursor-dialog]' })
export class CursorDialogDirective {
  constructor(private el: ElementRef) {
  }

  // @HostListener('mousemove', ['$event']) onMouseMoove(event: MouseEvent) {
  //   this.showDialog(true, event);
  // }

  @HostListener('mouseleave') onMouseLeave() {
    this.showDialog(false, event);
  }

  showDialog(flag, event) {
    if(flag) {
      // console.log(event.clientX, event.clientY);
      $("#cursor-dialog-box").css({top: event.clientY, left: event.clientX}).show();
    } else {
      // console.log(event.clientX, event.clientY);
      $("#cursor-dialog-box").hide();
    }

  }
}
