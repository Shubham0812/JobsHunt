import { Component, OnInit, Input } from "@angular/core";
import { IJobs } from "src/app/model/job-model";

@Component({
  selector: "app-job-card",
  templateUrl: "./job-card.component.html",
  styleUrls: ["./job-card.component.scss"]
})
export class JobCardComponent implements OnInit {
  @Input() jobData: IJobs;

  constructor() {}

  ngOnInit() {
    this.jobData.source = this.capitalizeFirstLetter(this.jobData.source);
    this.jobData.skills = this.capitalizeFirstLetter(this.jobData.skills);
    this.jobData.title = this.jobData.title.slice(0, 50);
    this.jobData.skills = this.jobData.skills.slice(0, 50);
    this.jobData.location = this.jobData.location.slice(0, 30);
  }

  capitalizeFirstLetter(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  onNavigate(link: string) {
    window.open(link, "_blank");
  }
}
