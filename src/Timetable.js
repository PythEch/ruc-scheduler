import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import moment from 'moment'
import DayTimeTable from 'material-ui-day-time-table'
import { observer } from 'mobx-react';
import { action, autorun, reaction} from 'mobx';
import store from './Store';


moment.locale('dk');

const intervalMinutes = 15;
const interval = moment.duration(intervalMinutes, 'minutes');


/**
 * Return text to be printed in cell.
 * @param {object} xx The data element that is being printed
 * @returns {object} The text that will appear in the cell
 */
function displayCell(xx) {
  return xx.text
}

/**
 * Return object's height in rows.
 * @param {object} xx The data element for a cell
 * @returns {number} The height of the element
 */
function calcHeight(xx) {
  return moment(xx.end, 'h:mma').diff(moment(xx.start, 'h:mma')) / interval
}

/**
 * Return text to be printed in row header.
 * @param {object} xx The data element for a list of cells
 * @returns {object} The text that will appear in the header.
 */
function displayHeader(xx) {
  return xx.name
}

/**
 * Determine whether a cell should be painted
 * @param {object} xx The data element being examined
 * @param {number} step The index of the row being painted
 * @returns {bool} True if cell should be coloured
 */
function isActive(xx, step) {
  var current = moment(store.minTime).add(step * interval)

  return moment(xx.start, 'h:mma') <= current &&
    current < moment(xx.end, 'h:mma')
}

/**
 * Return text to be printed in left-most column.
 * @param {number} step The index of the row being addressed
 * @returns {object} The text that will appear in the cell
 */
function showTime(step) {
  var start = moment(store.minTime).add(interval * step);
  var end = moment(start).add(interval);

  return `${start.format('HH:mm')}–${end.format('HH:mm')}`
}

/**
 * Return table-wide unique key for data cell element.
 * @param {object} xx The data element for a cell
 * @returns {object} The unique key of the cell
 */
function key(xx) {
  return xx.id
}

function calculateRowHeight() {
  return (window.innerHeight - 220) / getRowNum();
}

function getRowNum() {
  return (store.maxTime - store.minTime) / interval;
}

@observer
class Timetable extends Component {
  render() {
    return (
      <div>
        <center>
          <input type='button' value='<' id='prev' onClick={ () => store.previousWeek() } />
          <input type='button' value='This Week' id='thisWeek' onClick={ () => store.thisWeek() } style={{margin: 10, width: 100}} />
          <input type='button' value='>' id='next' onClick={ () => store.nextWeek() } />
        </center>
        <br />
        <DayTimeTable
          caption={ store.captionText }
          cellKey={key}
          calcCellHeight={calcHeight}
          showHeader={displayHeader}
          showCell={displayCell}
          showTime={ showTime.bind(this) }
          isActive={ isActive.bind(this) }
          max={ store.maxTime }
          min={ store.minTime }
          data={ store.timetable }
          rowNum={ getRowNum() }
          valueKey="info"
        />
      </div>
    );
  }

  handleResize = () => {
    // Old-school hack to generate table row height dynamically
    // FIXME: super slow

    let rowHeight = calculateRowHeight();
    let css = `tr, td { height: ${rowHeight}px !important }`;

    let style = document.getElementById('tableHeight');
    if (!style) {
      style = document.createElement('style');
      style.id = 'tableHeight';
      document.head.appendChild(style);
    }
    style.innerHTML = css;

    for (let element of document.getElementsByClassName("inner-timetable-block")) {
      element.style.height = (element.parentElement.clientHeight - 50) + "px"; // 48px for padding, 50 just to be sure
    }

    // FIXME: load textFit without resorting to hacks like this

    let retryTextFit = () => {
      if (window.textFit)
        window.textFit(document.getElementsByClassName("inner-timetable-block"), { multiline: true, alignVert: true });
      else
        window.setTimeout(retryTextFit, 100);
    };

    retryTextFit();
  };

  componentDidUpdate() {
    this.handleResize();
  }

  componentWillMount() {
    this.handleResize();
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  constructor(props) {
    super(props);

    //autorun(this.handleResize);
  }
}

export { Timetable, calculateRowHeight, getRowNum, calcHeight, interval };