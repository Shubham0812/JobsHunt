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

  dummyData: IJobs[] = [
    {
      id: "5b2b8a98263a5020388e87dc",
      title: "Senior Knowledge Analyst CKA",
      applylink:
        "https://www.techgig.com/jobs/Senior-Knowledge-Analyst-CKA/59843",
      jd: "",
      companyname: "Boston Consultancy Group",
      location: "Bengaluru/Bangalore",
      experience: "4-6 yrs",
      salary: "",
      type: "",
      skills: "cassandra",
      startdate: "",
      enddate: "",
      created: "",
      source: "techgig",
      timestamp: 1528959791.958316
    },
    {
      id: "5b2b8a9a263a5020388e87dd",
      title: "Lead - Software Engineering",
      applylink: "https://www.techgig.com/jobs/Lead-Software-Engineering/59655",
      jd: "",
      companyname: "Fidelity Mutual Fund",
      location: "Chennai",
      experience: "7-9 yrs",
      salary: "",
      type: "",
      skills: "Blockchain",
      startdate: "",
      enddate: "",
      created: "",
      source: "techgig",
      timestamp: 1528959791.958316
    },
    {
      id: "5b2b8a9a263a5020388e87de",
      title: "Salesforce Architect",
      applylink: "https://www.techgig.com/jobs/Salesforce-Architect/60149",
      jd: "",
      companyname: "Honeywell Automation India Ltd",
      location: "Bengaluru/Bangalore",
      experience: "10-12 yrs",
      salary: "",
      type: "",
      skills: "salesforce",
      startdate: "",
      enddate: "",
      created: "",
      source: "techgig",
      timestamp: 1528959791.958316
    }
  ];

  constructor(private http: HttpClient) {
    this.getJobDetails().subscribe(jobs => {
      this.jobDetails = jobs.data;
      console.log("Check jobs", this.jobDetails);
      this.changeFetchState(false);

      this.getUniqueSources();
      console.log("Sources", this.sources);
    });
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
