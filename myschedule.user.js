/*
    This is a script to navigate directly to your schedule.
    Copyright (C) 2015 Christoph "criztovyl" Schulz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
// ==UserScript==
// @name        MySchedule
// @namespace   de.joinoit.criztovyl.myschedule
// @description a little script for loading your schedule from welcome page or by location hash
// @include     http://www.osz-in-mol.de/osz-mol/infoplan/stplsrb/welcome.htm
// @match       http://www.osz-in-mol.de/osz-mol/infoplan/stplsrb/*/*/*.htm
// @version     1
// @grant       none
// @require     http://www.osz-in-mol.de/osz-mol/infoplan/stplsrb/untisscripts.js
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @require     http://joinout.de/lib/sprintf.min.js
// @require     http://joinout.de/lib/jquery.cookie.js
// @run-at document-end
// @grant none
// ==/UserScript==
// Add getWeekofYear() to Date
Date.prototype.getWeekofYear = function () {
  var d = new Date( + this);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
};
// Vars
// Short hand input tag
var ipt = getTag('input');
// Short hand form tag
var frm = getTag('form');
// Table for insert forms afterwards
var tbl = $('table').get(0);
// Cookie name
var cookieName = 'myschedule';
//Set path that cookie is global on website
$.cookie.defaults = {
  path: '/',
  expires: 365
};
// Load cookie
var cookie = $.cookie(cookieName);
cookie = cookie == undefined ? cookie : JSON.parse(cookie);
// Go function
var go = function () {
  if (cookie != undefined) {
    parent.main.location = getURL(cookie.TYPE, cookie.NR);
  } 
  else {
    alert('No Schedule set!');
  }
};
// Hash value to go directly to schedule
var goHash = '#myschedule';
// Creates URL for schedule
function getURL(type, nr) {
  // Get today
  var today = new Date();
  // Get week of year
  var week = today.getWeekofYear();
  // Set week +1 if is Sunday or Saturday
  week = today.getDay() == 0 || today.getDay() == 6 ? week + 1 : week;
  // To String
  week = week.toString();
  // Prefix 0 if is only single number
  week = week.length == 1 ? '0' + week : week;
  // Return url {type}/{week}/{type}{nr}.htm
  return sprintf('%s/%s/%1$s%s.htm', type, week, n2str(nr));
}
// Short hand for current window (frame) location

function getLocation() {
  return this.content[2].location;
}
// Short hand to get a tag from by tag name

function getTag(name) {
  return sprintf('<%s>', name);
}
// Returns an empty form with given css class name

function getStdForm(className) {
  return $(frm, {
    'method': 'post',
    'action': '#',
    'class': className
  });
}
// Returns a button with the given value (text), css class name and click event function

function getButton(val, className, click) {
  return $(ipt, {
    'type': 'button',
    'value': val,
    'class': className,
    'click': click
  });
}
// Returns the navigation form

function navigationForm() {
  // CSS class name
  var className = 'scheduleNav';
  // Form
  getStdForm(className)
  // Insert after first headings
  .insertAfter(tbl)
  // Append navigation button and break line afterwards
  .append(getButton('My Schedule', className, go)).append($('<br>'))
}
// Returns the set form

function setForm() {
  // CSS class name
  var className = 'scheduleSet';
  // click event function
  var set = function () {
    var strs = getLocation().pathname.split('/');
    var thisNr = strs.pop();
    strs.pop();
    var thisType = strs.pop();
    thisNr = thisNr.replace(new RegExp(thisType + '|(.htm)', 'g'), '').replace(/^0*/, '');
    //alert(thisType + ' ' + thisNr);
    $.cookie(cookieName, JSON.stringify({
      TYPE: thisType,
      NR: thisNr
    }));
    var x = JSON.parse($.cookie(cookieName));
    alert(sprintf('Set your schedule to %s%s.', x.TYPE, x.NR));
  }
  // Form

  getStdForm(className)
  // Insert after schedule table
  .insertAfter(tbl)
  // Append button to set schedule
  .append(getButton('Set', className, set));
}
// Check whether is welcome page

if (getLocation().pathname == '/osz-mol/infoplan/stplsrb/welcome.htm') {
  // Check if cookie is set
  if (cookie != undefined) {
    // Go directly to schedule if hash is myschedule
    if (parent.location.hash == goHash) {
      go();
    }
    // Display navigation form if cookie is set

    navigationForm();
  } 
  else {
    // Otherwiese display message
    $(tbl).after('Not set, please set schedule first.');
  }
}
// If is schedule page, display set dorm
 else {
  setForm();
}
