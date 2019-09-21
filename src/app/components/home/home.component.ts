import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataFetchService } from "../../services/data-fetch.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private dataFetchSvc: DataFetchService) {}

  ngOnInit() {}

  searchJobs() {
    console.log("Go to Explore jobs");
    this.dataFetchSvc.changeLoadState(true);
    setTimeout(() => {
      this.dataFetchSvc.changeLoadState(false);
      this.router.navigate(["/explore"]);
    }, 300);
  }
}
