import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { IJobs } from "../model/job-model";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataFetchService {
  jobUrl = "https://nut-case.s3.amazonaws.com/jobs.json";
  jobDetails: IJobs[];
  sources: string[] = [];
  private loading = new BehaviorSubject(false);
  private dataFetching = new BehaviorSubject(true);
  currentState = this.loading.asObservable();
  currentJobFetch = this.dataFetching.asObservable();

  // Since the locations provided in the JSON were too random and contained long strings, have hardcoded common locations.
  locations: string[] = [
    "Bengaluru",
    "Chennai",
    "Noida",
    "Mumbai",
    "Bhopal",
    "Hyderabad",
    "Guntur",
    "Ahmedabad",
    "Indore",
    "Panaji",
    "Delhi",
    "Pune",
    "Jaipur",
    "Patna",
    "Hosur",
    "Mysore",
    "Kolkata",
    "Gurgaon",
    "Chandigarh"
  ];

  experiences: string[] = [];

  constructor(private http: HttpClient) {
    this.getJobDetails().subscribe(
      jobs => {
        this.jobDetails = jobs.data;
        // console.log("Check jobs", this.jobDetails);
        this.changeFetchState(false);

        this.getUniqueSources();
        // console.log("Sources", this.sources);

        this.getUniqueExperiences();
        // console.log("Expierience", this.experiences);
      },
      err => {
        console.log("error");
      }
    );

    // this.jobDetails = this.dummyData;
  }

  getJobDetails(): Observable<any> {
    return this.http.get(this.jobUrl);
  }

  getUniqueSources() {
    this.jobDetails.forEach(job => {
      if (!this.sources.includes(job.source)) {
        this.sources.push(job.source);
      }
    });
  }

  getUniqueExperiences() {
    this.jobDetails.forEach(job => {
      if (!this.experiences.includes(job.experience)) {
        this.experiences.push(job.experience);
      }
    });
  }

  // getUniqueLocations() {
  //   this.jobDetails.forEach(job => {
  //     let splitLocations = job.location.replace(" ", " ").split(", ");
  //     splitLocations.forEach(location => {
  //       if (!this.locations.includes(location) && location !== "") {
  //         this.locations.push(location);
  //       }
  //     });
  //     // console.log("Location", job.location.replace("  ", " "));
  //     splitLocations = job.location.replace("  ", " ").split("/");
  //     splitLocations.forEach(location => {
  //       if (!this.locations.includes(location) && location !== "") {
  //         this.locations.push(location);
  //       }
  //     });
  //     splitLocations = job.location.split("/");
  //     splitLocations.forEach(location => {
  //       if (!this.locations.includes(location) && location !== "") {
  //         this.locations.push(location);
  //       }
  //     });
  //   });
  // }

  changeLoadState(state: boolean) {
    this.loading.next(state);
  }

  changeFetchState(state: boolean) {
    this.dataFetching.next(state);
  }

  getJobs() {
    return this.jobDetails;
  }
}
