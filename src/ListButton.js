import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import store from './Store';
import ReactDOM from 'react-dom';
import { TransitionMotion, spring, presets } from 'react-motion';
import { UnmountClosed } from 'react-collapse';

let globalTop = 0;
let globalMarginTop = 0;

class ListButton extends Component {
  @observable height = 61;
  ref = null;

  render() {
    return (
      <li
        ref={ this._setRef }
        className={ this.getClassName() }
        style={ { top: this.getTop()} }
        onClick={ this.onClick.bind(this) }
      >
        { this.props.text }
      </li>
    );
  }

  getTop() {
    // FIXME: REALLY BAD CODE, FIX MUTATIONS PROPERLY

    if (this.isActive()) {
      this.ref.parentNode.style.paddingBottom = (5.0 + this.height / 2.0) + 'px';
    }

    if (this.props.index === 0)
      globalTop = 0;

    if (this.isHidden()) return globalTop;

    let ret = globalTop;
    globalTop += this.height;

    return ret;
  }

  _setRef = (ref) => {
    if (!ref) return;
    //if (this.isHidden()) return;

    this.height = ref.offsetHeight;
    this.ref = ref;
  };

  _getSelectedIndex() {
    return store[this.indexProperty];
  }

  _setSelectedIndex(val) {
    if (val === -1) {
      globalMarginTop -= this.height;
    } else {
      globalMarginTop += this.height;
    }

    store[this.indexProperty] = val;
  }

  onClick() {
    let newIndex = this.isActive() ? - 1 : this.props.index;
    this._setSelectedIndex(newIndex);
  };

  isActive() {
    return this._getSelectedIndex() === this.props.index;
  }

  isHidden() {
    return this._getSelectedIndex() !== -1 && !this.isActive();
  }

  getClassName() {
    let className = this.className;
    if      (this.isActive()) className += ' active';
    else if (this.isHidden()) className += ' hidden';

    return className;
  }
}

@observer
class SelectedCourseListView extends Component {
  render() {
    let shouldShowTooltip = store.selectedCourses.filter(x => !x.isOpened).length === store.selectedCourses.length;

    return (
        <ul className='selected-courses-list'>
          <UnmountClosed isOpened={ shouldShowTooltip } springConfig={presets.wobbly} forceInitialAnimation={ true } key={ "course-tooltip" }>
            <li className='course-tooltip'>Choose the courses you're attending from the menu below...</li>
          </UnmountClosed>
          {
            store.selectedCourses.map((course, index) => {
              return (
                <UnmountClosed isOpened={ !!course.isOpened } springConfig={presets.wobbly} forceInitialAnimation={ true } key={ course.url }>
                  <SelectedCourseButton course={course} />
                </UnmountClosed>
              );
            })
          }
        </ul>

    );
  }
}

@observer
class SelectedCourseButton extends Component {
  render() {
    return (
      <li className="course" onClick={ this.onClick }>
        { this.props.course.name }
      </li>
    );
  }

  onClick = () => {
    this.props.course.isOpened = false;

    /* FIXME: hack to trigger mobx observable */
    let temp = store.selectedCourses;
    store.selectedCourses = [];
    store.selectedCourses = temp;
  };

  componentWillUnmount() {
    store.removeCourse(this.props.course);
  }
}

@observer
class UnselectedCourseButton extends ListButton {
  isHidden() {
    for (let c of store.selectedCourses) {
      if (c.url === this.props.course.url) {
        return c.isOpened;
      }
    }
    return false;
  }

  isActive() {
    return false;
  }

  onClick() {
    store.addCourse(this.props.course)
  };
}

export { ListButton, SelectedCourseListView, UnselectedCourseButton };
