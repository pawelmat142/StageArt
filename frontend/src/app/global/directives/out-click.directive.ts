import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { $desktop } from "../tools/media-query";

@Directive({
    selector: '[appOutClick]',
    standalone: true
})
export class OutClickDirective {

    @Output() outClick = new EventEmitter<MouseEvent | TouchEvent>()

    @Input() on = false

    constructor(private el: ElementRef) {}


    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent | TouchEvent): void {
        if (this.on && $desktop) {
            if (!this.el.nativeElement.contains(event.target)) {
                this.outClick.emit(event)
            }
        }
    }

    @HostListener('document:touchstart', ['$event'])
    onTouchStart(event: TouchEvent): void {
        if (this.on) {
            if (!this.el.nativeElement.contains(event.target)) {
                this.outClick.emit(event)
            }
        }
    }

}