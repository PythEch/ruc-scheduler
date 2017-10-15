import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ListButton, UnselectedCourseButton } from "./ListButton";
import store from './Store';


@observer
class MastersDepartmentListView extends Component {
  render() {
    return (
      <ul>
        {
          store.mastersDepartments.map((dept, index) => {
            return (
              <MastersDepartmentView
                index={ index }
                key={ dept.url }
                text={ dept.name }
                dept={ dept } />
            );
          })
        }
      </ul>
    );

  }
}


@observer
class MastersDepartmentView extends ListButton {
  constructor(props) {
    super(props);

    this.indexProperty = 'mastersDepartmentIndex';
    this.className = 'dept';
  }
}

@observer
class MastersCoursesListView extends Component {
  render() {
    if (store.mastersDepartmentIndex === -1)
      return null;

    return (
      <ul>
        {
          store.mastersCourses.map((course, index) => {
            return <MastersCourseView
              index={ index }
              key={ course.url }
              text={ course.name }
              course={ course } />;
          })
        }
      </ul>
    );
  }
}

@observer
class MastersCourseView extends UnselectedCourseButton {
  constructor(props) {
    super(props);

    this.className = 'masters-course';
  }
}

export { MastersDepartmentListView, MastersCoursesListView };