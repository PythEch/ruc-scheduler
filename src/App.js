import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { MastersDepartmentListView, MastersCoursesListView } from './MastersDepartments';
import BachelorDepartmentListView from './BachelorDepartments';
import CourseListView from './Courses';
import { Timetable } from './Timetable';
import store from './Store';
import { BACH_INDEX, MASTERS_INDEX, DegreeListView } from './Degrees';
import BachelorModuleListView from "./BachelorModules";
import { SelectedCourseListView } from "./ListButton";
import bumpTop from './bump-top.svg';
import bumpBottom from './bump-bottom.svg';

@observer
class App extends Component {
  render() {
    return (
      <div className='main'>
        <div className='sidelane'>
          <div>
            <span className='add-a-new-course'>Selected Courses</span>
            <img className='course-bump' src={bumpTop} />
            <SelectedCourseListView />
            <img className='bump-bottom' src={bumpBottom} />
          </div>
          <div className='courses-block'>
            <div className='courses-list'>
              <span className='add-a-new-course'>Add Courses</span>
              <img className='course-bump' src={bumpTop} />
            </div>
            <DegreeListView />
            <div className={ store.degreeIndex === BACH_INDEX ? '' : 'hidden' }>
              <BachelorDepartmentListView />
              <BachelorModuleListView />
            </div>
            <div className={ store.degreeIndex === MASTERS_INDEX ? '' : 'hidden' }>
              <MastersDepartmentListView />
              <MastersCoursesListView />
            </div>
          </div>
        </div>
        <div className='timetable'>
          <Timetable />
        </div>
      </div>
    );
  }
}

export default App;
