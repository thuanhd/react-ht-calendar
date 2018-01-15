'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint no-fallthrough: off */


var _dateArithmetic = require('date-arithmetic');

var _dateArithmetic2 = _interopRequireDefault(_dateArithmetic);

var _localizer = require('../localizer');

var _localizer2 = _interopRequireDefault(_localizer);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MILLI = {
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24
};

var MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

var dates = _extends({}, _dateArithmetic2.default, {
  monthsInYear: function monthsInYear(year) {
    var date = new Date(year, 0, 1);

    return MONTHS.map(function (i) {
      return dates.month(date, i);
    });
  },
  firstVisibleDay: function firstVisibleDay(date, culture) {
    var firstOfMonth = dates.startOf(date, 'month');

    return dates.startOf(firstOfMonth, 'week', _localizer2.default.startOfWeek(culture));
  },
  lastVisibleDay: function lastVisibleDay(date, culture) {
    var endOfMonth = dates.endOf(date, 'month');

    return dates.endOf(endOfMonth, 'week', _localizer2.default.startOfWeek(culture));
  },
  visibleDays: function visibleDays(date, culture) {
    var current = dates.firstVisibleDay(date, culture),
        last = dates.lastVisibleDay(date, culture),
        days = [];

    while (dates.lte(current, last, 'day')) {
      days.push(current);
      current = dates.add(current, 1, 'day');
    }

    return days;
  },
  ceil: function ceil(date, unit) {
    var floor = dates.startOf(date, unit);

    return dates.eq(floor, date) ? floor : dates.add(floor, 1, unit);
  },
  range: function range(start, end) {
    var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'day';

    var current = start,
        days = [];

    while (dates.lte(current, end, unit)) {
      days.push(current);
      current = dates.add(current, 1, unit);
    }

    return days;
  },
  merge: function merge(date, time) {
    if (time == null && date == null) return null;

    if (time == null) time = new Date();
    if (date == null) date = new Date();

    date = dates.startOf(date, 'day');
    date = dates.hours(date, dates.hours(time));
    date = dates.minutes(date, dates.minutes(time));
    date = dates.seconds(date, dates.seconds(time));
    return dates.milliseconds(date, dates.milliseconds(time));
  },
  sameMonth: function sameMonth(dateA, dateB) {
    return dates.eq(dateA, dateB, 'month');
  },
  isToday: function isToday(date) {
    return dates.eq(date, dates.today(), 'day');
  },
  eqTime: function eqTime(dateA, dateB) {
    return dates.hours(dateA) === dates.hours(dateB) && dates.minutes(dateA) === dates.minutes(dateB) && dates.seconds(dateA) === dates.seconds(dateB);
  },
  isJustDate: function isJustDate(date) {
    return dates.hours(date) === 0 && dates.minutes(date) === 0 && dates.seconds(date) === 0 && dates.milliseconds(date) === 0;
  },
  duration: function duration(start, end, unit, firstOfWeek) {
    if (unit === 'day') unit = 'date';
    return Math.abs(dates[unit](start, undefined, firstOfWeek) - dates[unit](end, undefined, firstOfWeek));
  },
  diff: function diff(dateA, dateB, unit) {
    if (!unit || unit === 'milliseconds') return Math.abs(+dateA - +dateB);

    // the .round() handles an edge case
    // with DST where the total won't be exact
    // since one day in the range may be shorter/longer by an hour
    return Math.round(Math.abs(+dates.startOf(dateA, unit) / MILLI[unit] - +dates.startOf(dateB, unit) / MILLI[unit]));
  },
  total: function total(date, unit) {
    var ms = date.getTime(),
        div = 1;

    switch (unit) {
      case 'week':
        div *= 7;
      case 'day':
        div *= 24;
      case 'hours':
        div *= 60;
      case 'minutes':
        div *= 60;
      case 'seconds':
        div *= 1000;
    }

    return ms / div;
  },
  week: function week(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
  },
  today: function today() {
    return dates.startOf(new Date(), 'day');
  },
  yesterday: function yesterday() {
    return dates.add(dates.startOf(new Date(), 'day'), -1, 'day');
  },
  tomorrow: function tomorrow() {
    return dates.add(dates.startOf(new Date(), 'day'), 1, 'day');
  },
  getDateWeek: function getDateWeek(date) {
    return date.getDay() === 0 ? 7 : date.getDay();
  },
  getDatesWeek: function getDatesWeek() {
    var monday = (0, _moment2.default)().isoWeekday(1);
    var visibleDates = [monday.toDate()];
    for (var i = 1; i < 7; i++) {
      visibleDates.push(monday.add(1, 'days').toDate());
    }
    return visibleDates;
  }
});

exports.default = dates;
module.exports = exports['default'];