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
  collapseLocation = false;
  collaspseExperience = false;

  processing = true;
  count = 0;
  searchQuery = "";

  selectedLocations: string[] = [];
  locations: string[] = [];
  experiences: string[] = [];
  selectedExperiences: string[] = [];

  pagination = 30;
  pageStart = 0;
  pageEnd = 29;
  selectedPage = 1;
  pages = [];

  noData = false;
  noSearchResult = false;
  errorData = false;

  filtersApplied = false;
  sideNavBarOpened = false;

  searchForm!: FormGroup;
  optionForm!: FormGroup;

  constructor(
    private dataFetchSvc: DataFetchService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: [""]
    });

    this.optionForm = this.formBuilder.group({
      select: [""]
    });
    this.optionForm.controls.select.setValue("30");
    this.optionForm.markAsPristine();
    this.optionForm.markAsUntouched();

    this.dataFetchSvc.currentJobFetch.subscribe(state => {
      this.processing = state;
      if (!this.processing) {
        this.locations = this.dataFetchSvc.locations;
        this.experiences = this.dataFetchSvc.experiences;
        this.allJobs = this.dataFetchSvc.getJobs();
        this.doPagination();
        this.getPages();
      }
    });

    this.dataFetchSvc.currentErrorState.subscribe(state => {
      console.log("Current state", state);
      this.errorData = state;
      if (this.errorData === true) {
        this.processing = false;
      }
    });
  }

  // gets the number of total pages to display
  getPages() {
    this.pages = [];
    if (this.searchQuery === "" && this.filtersApplied === false) {
      const pages = Math.round(this.allJobs.length / this.pagination);
      for (let i = 0; i < pages; i++) {
        this.pages.push(i + 1);
      }
    } else if (this.filtersApplied === true) {
      const pages = Math.round(this.filterJobs.length / this.pagination);
      for (let i = 0; i < pages; i++) {
        this.pages.push(i + 1);
      }
    } else if (this.searchQuery !== "") {
      const temp = this.searchJobs.length;
      const pages = Math.round(temp / this.pagination);

      for (let i = 0; i < pages; i++) {
        this.pages.push(i + 1);
      }
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
      this.pageStart = 0;
      this.pageEnd = this.pagination - 1;
      this.getPages();
      this.doPaginationQuery();
    }
  }

  pageChanged(val: number) {
    this.selectedPage = val;
    const pageStart = val * this.pagination - this.pagination;
    this.pageStart = pageStart;
    this.pageEnd = pageStart + this.pagination - 1;
    if (this.searchQuery !== "" && this.filtersApplied === true) {
      // console.log("filter and search too");
      this.jobs = [];
      this.doPaginationLocation();
    } else if (this.searchQuery !== "") {
      this.jobs = [];
      this.doPaginationQuery();
    } else if (this.filtersApplied === true) {
      // console.log("Filters page change", this.pageStart, this.pageEnd);
      this.doPaginationLocation();
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
    this.getPages();
  }

  doPaginationLocation() {
    this.filtersApplied = true;
    if (this.filterJobs.length === 0) {
      this.filterJobs = Array.from(this.jobs);
      this.jobs = this.jobs.splice(this.pageStart, this.pageEnd + 1);
    } else if (this.selectedLocations.length >= 1) {
      if (this.searchForm.controls.search.value === "") {
        this.jobs = [];
        this.filterJobs = [];
        this.searchBasedOnLocations();
      } else {
        this.count = 0;
        if (this.filterJobs.length === 0) {
          this.filterJobs = Array.from(this.jobs);
        }
        this.jobs = [];
        this.filterJobs.forEach(job => {
          if (this.count >= this.pageStart && this.count <= this.pageEnd) {
            this.jobs.push(job);
          }
          this.count += 1;
        });
      }
    } else {
      this.count = 0;
      this.jobs = [];
      this.filterJobs.forEach(job => {
        if (this.count >= this.pageStart && this.count <= this.pageEnd) {
          this.jobs.push(job);
        }
        this.count += 1;
      });
    }
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
      // console.log("No data from Search");
      this.searchJobs = [];
      this.noData = true;
    }
  }

  searchBasedOnJob() {
    const tempData: IJobs[] = this.filterJobs;
    this.searchJobs = Array.from(this.filterJobs);
    this.filterJobs = [];
    if (this.filtersApplied === true) {
      tempData.forEach(job => {
        if (job.title.toLowerCase().includes(this.searchQuery)) {
          this.filterJobs.push(job);
        }
      });
      // console.log("Search jobs", this.searchJobs, "filter", this.filterJobs);
      if (this.filterJobs.length === 0 && this.filtersApplied === true) {
        this.noSearchResult = true;
        this.jobs = [];
      }
      this.doPaginationLocation();
      this.getPages();
    } else {
      this.allJobs.forEach(job => {
        if (job.title.toLowerCase().includes(this.searchQuery)) {
          this.searchJobs.push(job);
        }
      });
    }
  }

  onSubmit() {
    this.searchQuery = this.searchForm.controls.search.value.toLowerCase();
    this.noSearchResult = false;
    if (this.searchQuery !== "" && this.filtersApplied === true) {
      this.searchJobs = [];
      this.resetPages();
      this.noData = false;
      // console.log("you are gonna go there ", this.filterJobs, this.jobs);
      this.searchBasedOnJob();
    } else if (this.searchQuery !== "") {
      this.searchJobs = [];
      this.resetPages();
      this.noData = false;
      this.processing = true;
      this.jobs = [];
      this.searchBasedOnJob();
      this.doPaginationQuery();
      this.getPages();
      this.processing = false;
    } else if (this.searchQuery === "" && this.filtersApplied === true) {
      // console.log("Check existing filter data", this.filterJobs);
      this.jobs = [];
      this.searchBasedOnLocations();
      this.getPages();
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
    this.jobs = [];
    this.selectedPage = 1;
    this.processing = true;
    if (this.searchJobs.length) {
      // console.log("search from searchJobs");
      this.jobs = [];
      this.selectedLocations.forEach(loc => {
        this.searchJobs.forEach(job => {
          if (job.location.toLowerCase().includes(loc.toLowerCase())) {
            this.jobs.push(job);
          }
        });
      });
      // console.log("Check jobs", this.jobs);
      if (!this.jobs.length) {
        this.noSearchResult = true;
      }
      this.doPaginationLocation();
      this.getPages();
    } else {
      // console.log("Location Search, no query");
      this.jobs = [];
      this.selectedLocations.forEach(loc => {
        this.allJobs.forEach(job => {
          if (job.location.toLowerCase().includes(loc.toLowerCase())) {
            this.jobs.push(job);
          }
        });
      });
      // console.log("Check jobs in Filter", this.jobs, this.filterJobs);
      this.filterJobs = [];
      this.doPaginationLocation();
      this.getPages();
    }
    this.processing = false;
  }

  locationToggle(event: any, location: string) {
    this.jobs = [];
    if (event.checked === true && !this.selectedLocations.includes(location)) {
      this.selectedLocations.push(location);
      this.filterJobs = [];
      this.searchBasedOnLocations();
    } else {
      // console.log("removing");
      this.removeLocations(location);
    }
    // console.log("Locations selected", this.selectedLocations);
    this.processing = false;
  }

  removeLocations(location: string) {
    const index = this.selectedLocations.indexOf(location);
    if (index > -1) {
      this.selectedLocations.splice(index, 1);
      this.resetPages();
      this.noSearchResult = false;
    }
    if (!this.selectedLocations.length) {
      this.searchQuery = this.searchForm.controls.search.value.toLowerCase();
      // console.log("hmm empty location");
      this.searchJobs = [];
      this.filtersApplied = false;
      this.resetPages();
      if (this.searchQuery !== "") {
        this.resetPages();
        this.noData = false;
        this.jobs = [];
        this.searchBasedOnJob();
        this.doPaginationQuery();
      } else if (this.searchJobs.length === 0) {
        this.searchForm.controls.search.setValue("");

        this.doPagination();
      } else {
        console.log("in here");
        this.jobs = [];
        this.doPaginationQuery();
      }
    } else {
      this.searchBasedOnLocations();
    }
  }

  resetPages() {
    this.selectedPage = 1;
    this.pageStart = 0;
    this.pageEnd = this.pagination - 1;
    this.processing = false;
  }

  locationsInList(location: string): boolean {
    if (this.selectedLocations.includes(location)) {
      return true;
    } else {
      return false;
    }
  }

  toggleTree() {
    this.collapseLocation = !this.collapseLocation;
  }

  toggleExperienceTree() {
    this.collaspseExperience = !this.collaspseExperience;
  }
}
