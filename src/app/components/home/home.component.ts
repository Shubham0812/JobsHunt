import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataFetchService } from "../../services/data-fetch.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from "@angular/cdk/layout";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  displayFeatures = false;

  public isLtMedium$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.XSmall])
    .pipe(map((res: BreakpointState) => res.matches));

  constructor(
    private router: Router,
    private dataFetchSvc: DataFetchService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
        this.isLtMedium$.subscribe((isLtMedium: boolean) => {
          this.displayFeatures = isLtMedium;
        });

  }

  searchJobs() {
    this.dataFetchSvc.changeLoadState(true);
    setTimeout(() => {
      this.dataFetchSvc.changeLoadState(false);
      this.router.navigate(["/explore"]);
    }, 300);
  }
}
