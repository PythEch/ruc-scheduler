import React, { Component } from 'react';
import { observer } from 'mobx-react';
import store from './Store';
import { ListButton } from './ListButton';

const DEGREES = ["Bachelor", "Master's"];

const BACH_INDEX    = DEGREES.indexOf("Bachelor");
const MASTERS_INDEX = DEGREES.indexOf("Master's");

@observer
class DegreeListView extends Component {
  render() {
    return (
      <ul>
        {
          DEGREES.map((degree, index) => {
            return (
              <DegreeView
                key={ index }
                index={ index }
                text={ degree }
              />
            );
          })
        }
      </ul>
    );
  }
}

@observer
class DegreeView extends ListButton {
  constructor(props) {
    super(props);

    this.indexProperty = 'degreeIndex';
    this.className = 'degree';
    this.isTopNode = true;
  }
}

export { BACH_INDEX, MASTERS_INDEX, DegreeListView };

