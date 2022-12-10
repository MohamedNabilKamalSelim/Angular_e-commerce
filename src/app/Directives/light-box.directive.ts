import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appLightBox]'
})
export class LightBoxDirective implements OnChanges {
  @Input() highLightColor: string = 'yellow';
  @Input() defaultColor: string = 'darkblue';
  constructor(private elemRef: ElementRef) {
  }
  ngOnChanges(): void {
    this.elemRef.nativeElement.style.border = `3px solid ${this.defaultColor}`;
  }

  @HostListener('mouseover') OnMouseOver() {
    this.elemRef.nativeElement.style.border = `3px solid ${this.highLightColor}`;
  }

  @HostListener('mouseout') OnMouseOut() {
    this.elemRef.nativeElement.style.border = `3px solid ${this.defaultColor}`;
  }
}
