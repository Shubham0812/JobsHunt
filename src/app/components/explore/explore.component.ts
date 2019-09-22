import { Component, OnInit } from "@angular/core";
import { DataFetchService } from "../../services/data-fetch.service";
import { IJobs } from "src/app/model/job-model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-explore",
  templateUrl: "./explore.component.html",
  styleUrls: ["./explore.component.scss"]
})
export class ExploreComponent implements OnInit {
  jobs: IJobs[] = [];
  searchJobs: IJobs[] = [];
  allJobs: IJobs[];
  processing = true;
  searchForm!: FormGroup;
  pagination = 20;
  count = 0;
  searchQuery = "";
  sideNavBarOpened = true;

  noData = false;

  constructor(
    private dataFetchSvc: DataFetchService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: [""]
    });

    this.dataFetchSvc.currentJobFetch.subscribe(state => {
      console.log("Data fetched?", state);
      this.processing = state;
      if (!this.processing) {
        this.allJobs = this.dataFetchSvc.getJobs();
        this.doPagination();
      }
    });
  }

  toggleSidebar() {
    this.sideNavBarOpened = !this.sideNavBarOpened;
  }

  optionChanged(val: number) {
    console.log("Option change", val);
    this.jobs = [];
    this.pagination = val;
    this.count = 0;
    if (this.searchQuery === "") {
      this.doPagination();
    } else {
      console.log("Developer query");
      this.doPaginationQuery();
    }
  }

  doPagination() {
    this.allJobs.forEach(job => {
      if (this.count < this.pagination) {
        this.jobs.push(job);
        this.count += 1;
      }
    });
  }

  doPaginationQuery() {
    this.count = 0;
    this.allJobs.forEach(job => {
      if (this.count < this.pagination) {
        if (job.title.toLowerCase().includes(this.searchQuery)) {
          this.jobs.push(job);
          this.count += 1;
        }
      }
    });
    if (!this.jobs.length) {
      console.log("No data from Search");
      this.searchJobs = [];
      this.noData = true;
    }
  }

  totalHits() {
    this.allJobs.forEach(job => {
      if (job.title.toLowerCase().includes(this.searchQuery)) {
        this.searchJobs.push(job);
      }
    });
  }

  onSubmit() {
    console.log("Submit called", this.searchForm.controls.search.value);
    this.searchQuery = this.searchForm.controls.search.value.toLowerCase();
    if (this.searchQuery !== "") {
      this.noData = false;
      this.processing = true;
      this.jobs = [];
      this.totalHits();
      this.doPaginationQuery();
      this.processing = false;
    } else {
      this.noData = false;

      this.jobs = [];
      this.searchJobs = [];
      this.count = 0;
      this.searchQuery = "";
      this.doPagination();
    }
  }
}
