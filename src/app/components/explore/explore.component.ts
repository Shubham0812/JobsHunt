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
  filterJobs: IJobs[] = [];
  allJobs: IJobs[];
  processing = true;
  searchForm!: FormGroup;
  count = 0;
  searchQuery = "";
  sideNavBarOpened = false;
  selectedLocations: string[] = [];

  locations: string[] = [];
  pagination = 30;
  pageStart = 0;
  pageEnd = 29;
  selectedPage = 1;
  filtersApplied = false;
  pages = [];

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
        this.locations = this.dataFetchSvc.locations;
        this.allJobs = this.dataFetchSvc.getJobs();
        this.doPagination();
        this.getPages();
      }
    });
  }

  getPages() {
    if (this.searchQuery === "") {
      this.pages = [];
      const temp = this.allJobs.length;
      let pages = Math.round(temp / this.pagination);

      if (temp % this.pagination !== 0) {
        pages += 1;
      }

      for (let i = 0; i < pages; i++) {
        this.pages.push(i + 1);
      }
      console.log("Total pages", this.pages);
    } else {
      console.log("Search query not empty");
      this.pages = [];
      const temp = this.searchJobs.length;
      let pages = Math.round(temp / this.pagination);

      if (temp % this.pagination !== 0) {
        pages += 1;
      }

      for (let i = 0; i < pages; i++) {
        this.pages.push(i + 1);
      }

      console.log("Total pages", this.pages);
    }
  }

  toggleSidebar() {
    this.sideNavBarOpened = !this.sideNavBarOpened;
  }

  optionChanged(val: number) {
    this.jobs = [];
    this.pagination = Number(val);
    this.selectedPage = 1;
    if (this.searchQuery === "") {
      this.pageStart = 0;
      this.pageEnd = this.pagination - 1;
      this.getPages();
      this.doPagination();
    } else {
      console.log("Developer query");
      this.pageStart = 0;
      this.pageEnd = this.pagination - 1;
      this.getPages();
      this.doPaginationQuery();
    }
  }

  pageChanged(val: number) {
    this.selectedPage = val;
    console.log("Page changed", val);
    const pageStart = val * this.pagination - this.pagination;
    console.log("Page start", pageStart);
    this.pageStart = pageStart;
    this.pageEnd = pageStart + this.pagination - 1;
    console.log("Pages end", pageStart + Number(this.pagination));
    if (this.searchQuery !== "") {
      this.jobs = [];
      this.doPaginationQuery();
    } else {
      this.doPagination();
    }
  }

  doPagination() {
    this.count = 0;
    this.jobs = [];
    this.allJobs.forEach(job => {
      if (this.count >= this.pageStart && this.count <= this.pageEnd) {
        this.jobs.push(job);
      }
      this.count += 1;
    });
  }

  doPaginationLocation() {
    this.filterJobs = this.jobs;
    this.jobs = this.jobs.splice(this.pageStart, this.pageEnd + 1);
  }

  doPaginationQuery() {
    this.count = 0;
    this.searchJobs.forEach(job => {
      if (this.count >= this.pageStart && this.count <= this.pageEnd) {
        this.jobs.push(job);
      }
      this.count += 1;
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
      this.searchJobs = [];
      this.totalHits();
      this.doPaginationQuery();
      this.getPages();

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

  searchBasedOnLocations() {
    this.processing = true;
    if (this.searchJobs.length) {
      console.log("search from searchJobs");
    } else {
      console.log("in here");
      this.jobs = [];
      this.selectedLocations.forEach(loc => {
        this.allJobs.forEach(job => {
          if (job.location.toLowerCase().includes(loc.toLowerCase())) {
            this.jobs.push(job);
          }
        });
      });
      console.log("Check jobs", this.jobs);
      this.doPaginationLocation();
      this.getPages();
      this.processing = false;
    }
  }

  locationToggle(event: any, location: string) {
    console.log("Selection event", event.checked, location);
    if (event.checked && !this.selectedLocations.includes(location)) {
      this.selectedLocations.push(location);
      this.searchBasedOnLocations();
    } else {
      const index = this.selectedLocations.indexOf(location);
      if (index > -1) {
        this.selectedLocations.splice(index, 1);
      }
      this.searchBasedOnLocations();

      if (!this.selectedLocations.length) {
        this.doPagination();
      }
    }
    console.log("Locations selected", this.selectedLocations);
  }
}
