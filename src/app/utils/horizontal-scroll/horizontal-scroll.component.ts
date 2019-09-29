import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { Subscription, fromEvent } from "rxjs";
import { debounceTime, throttleTime } from "rxjs/operators";

@Component({
  selector: "app-horizontal-scroll",
  templateUrl: "./horizontal-scroll.component.html",
  styleUrls: ["./horizontal-scroll.component.scss"]
})
export class HorizontalScrollComponent implements OnInit, OnDestroy {
  disableNext: boolean;
  disablePrev: boolean;
  scrollObserver: Subscription;

  @ViewChild("cardContents", { read: ElementRef, static: false })
  public cardContents: ElementRef;

  constructor() {
    this.disablePrev = true;
    setTimeout(() => {
      this.initializeObserver();
      this.updateNavigationButtonStatus(this.cardContents
        .nativeElement as HTMLElement);
    }, 500);
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.scrollObserver) {
      this.scrollObserver.unsubscribe();
    }
  }

  initializeObserver() {
    this.scrollObserver = fromEvent(this.cardContents.nativeElement, "scroll")
      .pipe(debounceTime(200))
      .pipe(throttleTime(200))
      .subscribe(_ => {
        this.updateNavigationButtonStatus(this.cardContents
          .nativeElement as HTMLElement);
      });
  }

  public scrollRight(): void {
    const clientWidth = this.cardContents.nativeElement.clientWidth;
    this.cardContents.nativeElement.scrollTo({
      left: this.cardContents.nativeElement.scrollLeft + clientWidth + 2,
      behavior: "smooth"
    });
  }

  public scrollLeft(): void {
    const clientWidth = this.cardContents.nativeElement.clientWidth;
    this.cardContents.nativeElement.scrollTo({
      left: this.cardContents.nativeElement.scrollLeft - clientWidth - 2,
      behavior: "smooth"
    });
  }

  updateNavigationButtonStatus(element: HTMLElement) {
    console.log("element scroll", element.scrollWidth, element.clientWidth);
    if (element.scrollWidth > element.clientWidth) {
      this.disableNext = false;
    } else {
      this.disableNext = true;
    }

    if (element.scrollLeft === 0) {
      this.disablePrev = true;
    } else {
      this.disablePrev = false;
    }
    if (element.scrollWidth === element.clientWidth + element.scrollLeft) {
      this.disableNext = true;
    } else {
      this.disableNext = false;
    }
  }
}
