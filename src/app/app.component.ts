import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataFetchService } from "../app/services/data-fetch.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  loading = false;

  title = "JobsHunt";

  constructor(private router: Router, private dataFetchSvc: DataFetchService) {
    console.log("App initialization");
  }

  ngOnInit() {
    this.dataFetchSvc.currentState.subscribe(state => {
      console.log("Current state", state);
      this.loading = state;
    });
  }
}
