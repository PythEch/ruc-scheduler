import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import store from './Store';
import { ListButton, UnselectedCourseButton } from './ListButton';


@observer
class BachelorModuleListView extends Component {
  render() {
    if (store.bachelorDepartmentIndex === -1)
      return null;

    let continuum = null;
    switch (store.bachelorModuleIndex) {
      case 0:
        continuum = <BasicCoursesListView />;
        break;
      case 1:
        continuum = <SubjectModulesListView />;
        break;
      case 2:
        continuum = <OptionalCoursesListView />;
        break;
    }

    return (
      <div>
        <ul>
          <BasicCourses text='Basic Courses' index={ 0 } />
          <SubjectModules text='Subject Modules' index={ 1 } />
          <OptionalCourses text='Optional Courses' index={ 2 } />
        </ul>
        { continuum }
      </div>
    );
  }
}


@observer
class BasicCourses extends ListButton {
  constructor(props) {
    super(props);

    this.indexProperty = 'bachelorModuleIndex';
    this.className = 'bach-basic';
  }
}

@observer
class SubjectModules extends ListButton {
  constructor(props) {
    super(props);

    this.indexProperty = 'bachelorModuleIndex';
    this.className = 'bach-subject';
  }
}

@observer
class OptionalCourses extends ListButton {
  constructor(props) {
    super(props);

    this.indexProperty = 'bachelorModuleIndex';
    this.className = 'bach-optional';
  }
}

@observer
class BasicCoursesListView extends Component {
  render() {
    return (
      <ul>
        {
          store.basicCourses.map((course, index) => {
            return <BasicCourseView
                      index={ index }
                      key={ index }
                      text={ course.name }
                      course={ course } />;
          })
        }
      </ul>
    );
  }
}

@observer
class BasicCourseView extends UnselectedCourseButton {
  constructor(props) {
    super(props);

    this.indexProperty = 'bachelorBasicCourseIndex';
    this.className = 'bach-basic-course';
  }
}

@observer
class SubjectModulesListView extends Component {
  render() {
    let selectedDept = { "courses": [] };
    if (store.bachelorSubjectModuleDepartmentIndex !== -1)
      selectedDept = store.subjectModules[store.bachelorSubjectModuleDepartmentIndex];

    return (
      <div>
        <ul>
          {
            store.subjectModules.map((module, index) => {
              return <SubjectModuleDepartmentView
                index={ index }
                key={ index }
                text={ module.name }
                module={ module } />;
            })
          }
        </ul>
        <ul>
          {
            selectedDept.courses.map((course, index) => {
              return <SubjectCourseView
                index={ index }
                key={ index }
                text={ course.name }
                course={ course }
                />;
            })
          }
        </ul>
      </div>
    );
  }
}

@observer
class SubjectCourseView extends UnselectedCourseButton {
  constructor(props) {
    super(props);

    this.className = 'bach-subject-course';
  }
}

@observer
class SubjectModuleDepartmentView extends ListButton {
  constructor(props) {
    super(props);

    this.indexProperty = 'bachelorSubjectModuleDepartmentIndex';
    this.className = 'subject-module-dept';
  }
}

@observer
class OptionalCoursesListView extends Component {
  render() {

    return (
      <ul>
        {
          store.optionalCourses.map((course, index) => {
            return <OptionalCourseView
              index={ index }
              key={ index }
              text={ course.name }
              course={ course } />;
          })
        }
      </ul>
    );
  }
}

@observer
class OptionalCourseView extends UnselectedCourseButton {
  constructor(props) {
    super(props);

    this.className = 'bach-optional-course';
  }
}

export default BachelorModuleListView;