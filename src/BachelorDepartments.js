import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import store from './Store';
import { ListButton } from "./ListButton";

@observer
class BachelorDepartmentListView extends Component {
  render() {
    return (
      <ul>
        {
          store.bachelorDepartments.map((dept, index) => {
            return (
              <BachelorDepartmentView text={ dept } index={ index } key={ dept } />
            );
          })
        }
      </ul>
    );
  }
}

@observer
class BachelorDepartmentView extends ListButton {
  constructor(props) {
    super(props);

    this.indexProperty = 'bachelorDepartmentIndex';
    this.className = 'bach-dept';
  }
}

export default BachelorDepartmentListView;