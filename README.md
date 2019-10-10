# JobsHunt - Job Search Portal

Web Page created with Angular 8, which helps the user to search and apply for jobs.

## Motivation

This project was created for demonstrating my Angular skills, the Jobs API was provided by BYJU's.


## Technologies Used

 - Angular 8
 - Typescript
 - HTML5 & SCSS
 
 ## Features
 
 - Clean and simple user interface.
 - Users can search jobs based on different job profiles.
 - Users can apply filters and search jobs based on location and experience.

## Code Example

    // gets the number of total pages to display

	getPages() {
		this.pages = [];
		if (this.searchQuery ===  ""  &&  this.filtersApplied ===  false) {
			const pages = Math.round(this.allJobs.length /  this.pagination);
			for (let i =  0; i < pages; i++) {
				this.pages.push(i +  1);
			}
		} else  if (this.filtersApplied ===  true) {
			const pages = Math.round(this.filterJobs.length /  this.pagination);
			for (let i =  0; i < pages; i++) {
				this.pages.push(i +  1);
			}

		} else  if (this.searchQuery !==  "") {	
			const temp =  this.searchJobs.length;
			const pages = Math.round(temp /  this.pagination);
			for (let i =  0; i < pages; i++) {
				this.pages.push(i +  1);
			}
		}
	}

The project supports Pagination and filters.

## How to use ?

Download the zip file or clone the project.

#### Installing

 - Run `npm install` to install the necessary dependencies. 
 - Run `ng serve -o`  in the terminal to run the project.

#### Prerequisites

- An active internet connection.
- Node JS.
- Modern Browser such as Edge, Chrome, Safari, Firefox.


## Credits

**©** **Shubham Kumar Singh** | *2019*

