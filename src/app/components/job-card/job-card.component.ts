import { Component, OnInit, Input } from "@angular/core";
import { IJobs } from "src/app/model/job-model";

@Component({
  selector: "app-job-card",
  templateUrl: "./job-card.component.html",
  styleUrls: ["./job-card.component.scss"]
})
export class JobCardComponent implements OnInit {
  @Input() jobData: IJobs;
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  timeStamp = "";

  constructor() {}

  ngOnInit() {
    this.jobData.source = this.capitalizeFirstLetter(this.jobData.source);
    this.jobData.skills = this.capitalizeFirstLetter(this.jobData.skills);
    this.jobData.title = this.jobData.title.slice(0, 50);
    this.jobData.skills = this.jobData.skills.slice(0, 50);
    // this.jobData.location = this.jobData.location.slice(0, 19);
    this.timeStamp = this.dateConverter(this.jobData.timestamp);
  }

  capitalizeFirstLetter(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  onNavigate(link: string) {
    window.open(link, "_blank");
  }

  dateConverter(timestamp: number): string {
    const date = new Date(timestamp * 1000);

    return (
      date.getUTCDate() +
      " " +
      this.months[date.getUTCMonth()] +
      " " +
      date.getFullYear()
    );
  }
}
