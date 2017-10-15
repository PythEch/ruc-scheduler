# ruc-scheduler
The missing timetable web application for Roskilde University made out of boredom.

RUC doesn't have an official timetable website except for [kursus.ruc.dk](https://kursus.ruc.dk) where you have to keep track of each course by yourself. This was a tiresome and unnecessary work since every course has its own schedule and lecturers sometimes change their plans. I assume having a timetable web application is a fairly standard procedure for most universities, so I thought I could teach myself React while solving this problem I had, cool.

Demo at [here](https://turkmenog.lu/ruc-scheduler/)

![Sample screenshot](https://turkmenog.lu/ruc-screenshot.png)

## To do
Although the application is fairly functional, there are still some details missing.

  * Make it mobile friendly, responsive design
  * Refactor UI design (better menu colors, week navigation etc.)
  * Refactor code, lots of hacks included, I promise (my first React project!).
  * Find an elegant solution for cases where multiple courses occupy the same time range. (Currently the application shrugs off displaying buggy results)
  * Display correct data for cases where a course takes more than one day (e.g the course has a scheduled exam for a week but exact day may be unavailable)

## Notes
* Currently the application works by making scraping data from [kursus.ruc.dk](https://kursus.ruc.dk), creating jsons for front-end. I will publish these Python scripts soon.
* Some texts may appear Danish, as these are not translated to English by [kursus.ruc.dk](https://kursus.ruc.dk), it's a feature :)

## Dependencies
* [Textfit](https://github.com/STRML/textFit)
* [Material UI Day Timetable](https://www.npmjs.com/package/material-ui-day-time-table)
* [Axios](https://www.npmjs.com/package/axios)
* Mobx
* React
* Babel
* SASS
