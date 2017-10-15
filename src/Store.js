import React from 'react';
import moment from 'moment';
import { observable, computed, action, autorun } from 'mobx';
import axios from 'axios';
import { calcHeight, calculateRowHeight, interval } from "./Timetable";

let globalId = 0;

class RandomColor {
  colorCollection = [
    ['#004e66', 'white'],
    ['#c03546', 'white'],
    ['#4f953b', 'white'],
    ['#ff5f2e', 'white'],
    ['#47b8e0', 'white'],
    ['#58C9B9', 'white']
  ];

  courseToColor = {};
  lastIndex = -1;

  getIndexForCourse() {
    let newIndex = (this.lastIndex + 1) % this.colorCollection.length;

    this.lastIndex = newIndex;
    return newIndex;
  }

  getColor(courseUrl) {
    if (!this.courseToColor[courseUrl]) {
      this.courseToColor[courseUrl] = this.colorCollection[this.getIndexForCourse()];
    }

    return this.courseToColor[courseUrl];
  }
}

const BACH_DEPTS = [
  'humbach',
  'sambach',
  'natbach',
  'humtekbach'
];

class Store {
  @observable selectedWeek;
  @observable timetable = [];
  @observable minTime = null;
  @observable maxTime = null;

  @observable degreeIndex = -1;
  @observable bachelorDepartmentIndex = -1;
  @observable bachelorModuleIndex = -1;
  @observable bachelorSubjectModuleIndex = -1;
  @observable bachelorSubjectModuleDepartmentIndex = -1;
  @observable bachelorSubjectCourseIndex = -1;

  @observable basicCourses = [];
  @observable subjectModules = [];
  @observable optionalCourses = [];

  @observable mastersDepartments = [];
  @observable mastersDepartmentIndex = -1;
  @observable mastersCourses = [];

  @observable selectedCourses = [];
  @observable removedCourses = [];
  @observable bachelorDepartments = [];

  colorLib = new RandomColor();

  saveCourses() {
    let cachedCourses = this.selectedCourses.map(course => {
      return { "name": course.name, "url": course.url }
    });

    localStorage.setItem("cachedCourses", JSON.stringify(cachedCourses));
  }

  loadCourses() {
    let cachedCourses = localStorage.getItem("cachedCourses");
    if (!cachedCourses) return;

    cachedCourses = JSON.parse(cachedCourses);

    try {
      for (let course of cachedCourses) {
        this.addCourse(course);
      }
    } catch (e) {
      localStorage.setItem("cachedCourses", null);
    }
  }

  @action
  removeCourse(course) {
    this.selectedCourses = this.selectedCourses
      .filter(x => x.url !== course.url);

    this.saveCourses();
  }

  @action
  addCourse(course) {
    let classId = course.url.split('/');
    classId = classId[classId.length - 1];

    axios.get(`json/course/${classId}.json`)
      .then(action(response => {
        response.data.isOpened = observable(true);
        this.selectedCourses.push(response.data);
        this.saveCourses();
      }));
  }

  @action
  nextWeek() {
    this.selectedWeek = moment(this.selectedWeek).add(1, 'weeks');
  }

  @action
  previousWeek() {
    this.selectedWeek = moment(this.selectedWeek).add(-1, 'weeks');
  }

  @action
  thisWeek() {
    this.selectedWeek = moment();
  }

  @computed
  get captionText() {
    let weekText;
    weekText  = this.selectedWeek.day('Monday').format('LL');
    weekText += ' - ';
    weekText += this.selectedWeek.day('Friday').format('LL');

    return weekText;
  }

  handleBachelorCourses = () => {
    if (this.bachelorDepartmentIndex === -1)
      return;

    let url;

    url  = 'json/';
    url += BACH_DEPTS[ this.bachelorDepartmentIndex ];
    url += '.json';

    axios.get(url)
      .then(response => {
        this.basicCourses    = response.data['basic_courses'];
        this.subjectModules  = response.data['subject_courses'];
        this.optionalCourses = response.data['optional_courses'];
    });
  };

  handleMastersDepartments = () => {
    if (this.degreeIndex !== 1) return;

    axios.get('json/departments.json')
      .then(response => {
        this.mastersDepartments = response.data;
      });
  };

  handleMastersCourses = () => {
    if (this.mastersDepartmentIndex === -1)
      return;

    let selectedMasters = this.mastersDepartments[this.mastersDepartmentIndex];

    let url = `json/departments${selectedMasters.url}.json`;
    axios.get(url)
      .then(response => {
        /* FIXME: Mobx workaround to register timetables */
        //for (let c of response.data)
        //   c.timetable = [];

        this.mastersCourses = response.data;
      });
  };

  handleTimetable = () => {
    let newTimetable = [
      {
        name: 'Monday',
        info: []
      },
      {
        name: 'Tuesday',
        info: []
      },
      {
        name: 'Wednesday',
        info: []
      },
      {
        name: 'Thursday',
        info: []
      },
      {
        name: 'Friday',
        info: []
      },
    ];

    let minTime = null;
    let maxTime = null;

    for (let course of this.selectedCourses) {
      if (!course.isOpened) continue;

      for (let d of course.timetable) {

        let from = moment(d.from);
        let to = moment(d.to);

        if (from.week() !== this.selectedWeek.week())
          continue;

        let fromTime = moment(from.format('HH:mm'), 'HH:mm');
        let toTime = moment(to.format('HH:mm'), 'HH:mm');

        if (!minTime || fromTime < minTime)
          minTime = fromTime;

        if (!maxTime || toTime > maxTime)
          maxTime = toTime;

        let dayIndex = from.day() - 1;

        let temp = this.colorLib.getColor(course.url);
        let bgcolor = temp[0];
        let fgcolor = temp[1];

        let text = <div className='inner-timetable-block'>
          {course.name}
          <br/><br/>
          <span style={{whiteSpace: 'nowrap'}}>{from.format('HH:mm')} - {to.format('HH:mm')}</span>
          <br/><br/>
          {d.location ? d.location : 'Location Unknown'}
        </div>;

        newTimetable[dayIndex].info.push(
          {
            start: from.format('HH:mm'),
            end: to.format('HH:mm'),
            text: text,
            id: globalId++,
            props: {
              className: 'timetable-block',
              style: {
                backgroundColor: bgcolor,
                color: fgcolor,
              }
            }
          }
        );
      }
    }
/*
    // Final touch, calculate heights of divs
    let rowHeight = (maxTime - minTime) / interval;

    for (let day of newTimetable) {
      for (let block of day.info) {

        let cell = { start: block.start, end: block.end };
        let divHeight = (calcHeight(cell) - 2) * rowHeight;

        block.text = React.cloneElement(block.text, {style: {height: divHeight}});
      }
    }
*/
    this.timetable = newTimetable;
    this.minTime   = minTime;
    this.maxTime   = maxTime;
  };

  handleBachelorDepartments = () => {
    /* FIXME: Nodejs? bug, can't import BACH_INDEX */
    if (this.degreeIndex !== 0) return;
    if (this.bachelorDepartments.length !== 0) return;

    this.bachelorDepartments = [
      'Humanities',
      'Natural Sciences',
      'Social Sciences',
      'Humanities & Technology'
    ];
  };

  handleMenuNavigation = () => {
    if (this.bachelorDepartmentIndex === -1) {
      this.bachelorModuleIndex = -1;
    }

    if (this.bachelorModuleIndex === -1) {
      this.bachelorSubjectModuleIndex = -1;
    }

    if (this.bachelorSubjectModuleIndex === -1) {
      this.bachelorSubjectModuleDepartmentIndex = -1;
    }
  };

  constructor() {
    this.thisWeek();
    this.loadCourses();

    autorun(this.handleBachelorCourses);
    autorun(this.handleMastersDepartments);
    autorun(this.handleMastersCourses);
    autorun(this.handleTimetable);
    autorun(this.handleBachelorDepartments);
    autorun(this.handleMenuNavigation);

    let script = document.createElement('script');
    script.async = false;
    script.src = "textFit.min.js";
    document.head.appendChild(script);
  }
}

const store = new Store();

export default store;