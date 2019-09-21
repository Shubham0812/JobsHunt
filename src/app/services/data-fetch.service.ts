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
  private loadSource = new BehaviorSubject(false);
  currentState = this.loadSource.asObservable();

  constructor(private http: HttpClient) {
    this.getJobDetails().subscribe(jobs => {
      this.jobDetails = jobs.data;
      console.log("Check jobs", this.jobDetails);

      this.getUniqueSources();
      console.log("Sources", this.sources);
    });
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

  changeLoadState(state: boolean) {
    this.loadSource.next(state);
  }
}
