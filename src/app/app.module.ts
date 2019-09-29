import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  MatToolbarModule,
  MatProgressBarModule,
  MatButtonModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatCardModule,
  MatIconModule,
  MatTooltipModule,
  MatSelectModule,
  MatInputModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatChipsModule,
} from "@angular/material";

import { MatTabsModule } from "@angular/material/tabs";
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from "./components/home/home.component";
import { ExploreComponent } from "./components/explore/explore.component";
import { JobCardComponent } from "./components/job-card/job-card.component";
import { HorizontalScrollModule } from "./utils/horizontal-scroll/horizontal-scroll.module";
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExploreComponent,
    JobCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HorizontalScrollModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
