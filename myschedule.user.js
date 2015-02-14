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
// @require     http://www.osz-in-mol.de/osz-mol/infoplan/stplsrb/untisscripts.js
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @require     http://joinout.de/lib/sprintf.min.js
// @require     http://joinout.de/lib/jquery.cookie.js
// @require     http://code.jquery.com/ui/1.11.2/jquery-ui.min.js
// @resource   jq_ui_css  http://code.jquery.com/ui/1.10.4/themes/black-tie/jquery-ui.css
// @version     3
// @run-at document-end
// @grant GM_getResourceText
// @grant GM_addStyle
// ==/UserScript==
// Add getWeekofYear() to Date
Date.prototype.getWeekofYear = function () {
  var d = new Date( + this);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
};
//Load jQuery UI CSS
var jq_ui_css = GM_getResourceText('jq_ui_css');
//Fix image links
jq_ui_css = jq_ui_css.replace(new RegExp('images/ui-', 'g'), 'http://code.jquery.com/ui/1.10.4/themes/black-tie/images/ui-');
//Add to page
GM_addStyle(jq_ui_css);
// Table for insert forms afterwards (magically both welcome and schedule page)
var tbl = $('table').get(0);
// Schedules root
var root = '/osz-mol/infoplan/stplsrb/';
// Cookie name
var cookieName = 'myschedule';
// Hash value to go directly to schedule
var goHash = '#myschedule';
// Schedule's number and type
var nr,
type;
//Set path that cookie is global on website
$.cookie.defaults = {
  path: '/',
  expires: 365
};
$.cookie.json = true;
// Load from cookie
var cookie = $.cookie(cookieName);
if (cookie != undefined) {
  nr = cookie.NR;
  type = cookie.TYPE;
}
// Go To ... function

function goto(url, hash) {
  parent.main.location = url;
  parent.location.hash = hash == undefined ? '' : hash;
}
// Go function

var go = function () {
  if (cookie != undefined) {
    goto(getURL(), goHash);
  } 
  else {
    alert('No Schedule set!');
  }
};
// Creates URL for schedule
function getURL(weekOffset) {
  // Get today
  var today = new Date();
  // Get week of year
  var week = today.getWeekofYear();
  // Set week +1 if is Sunday or Saturday
  week = today.getDay() == 0 || today.getDay() == 6 ? week + 1 : week;
  //Offset if offset is set
  week = weekOffset == undefined ? week : week + weekOffset;
  // To String
  week = week.toString();
  // Prefix 0 if is only single number
  week = week.length == 1 ? '0' + week : week;
  // Return url {type}/{week}/{type}{nr}.htm
  return sprintf('%s%s/%s/%2$s%s.htm', root, type, week, n2str(nr));
}
// Short hand for current window (frame) location

function getLocation() {
  return this.content[2].location;
}
// Returns an empty form with given css class name

function getStdForm(className) {
  return $('<form>', {
    'method': 'post',
    'action': '#',
    'class': className
  });
}
// Returns a button with the given value (text), css class name and click event function

function getButton(val, className, click) {
  return $('<input>', {
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
// (The form that sets which schedule to use)

function setForm() {
  // CSS class name
  var className = 'scheduleSet';
  // click event function
  var set = function () {
    //Split URL
    var strs = getLocation().pathname.split('/');
    //Pops filename that contains the ID and number
    var filename = strs.pop();
    //Pops useless week
    strs.pop();
    //Pops the schedule type
    var thisType = strs.pop();
    //Extract nr from file name by remove type and file ending and useless zeros
    var thisNr = filename.replace(new RegExp(thisType + '|(.htm)', 'g'), '').replace(/^0*/, '');
    //Store into cookie
    $.cookie(cookieName, {
      TYPE: thisType,
      NR: thisNr
    });
    //Re-receive cookie, for testing/debbugging purposes
    var x = $.cookie(cookieName);
    //Informs the user which schedule was set (for debugging cookie is used)
    alert(sprintf('Set your schedule to %s%s.', x.TYPE, x.NR));
  }
  // Build the Form

  var setForm = getStdForm(className)
  // Insert after schedule table
  .insertAfter(tbl);
  //Append "Previous Week" only if schedule is set
  if (cookie != undefined) {
    setForm.append(getButton('Previous Week', className, function(){
      console.log(weekOffset()-1, weekOffset());
      urlcheck(className, getURL(weekOffset()-1));
    }));
  }
  // Append button to set schedule

  setForm.append(getButton('Set', className, set))
  // Append button to go to start/welcome page
  .append(getButton('Welcome Page', className, function () {
    goto(root + 'welcome.htm');
  }));
  //Insert "Next Week "only if schedule is set.
  if (cookie != undefined) {
    setForm.append(getButton('Next Week', className, function () {
      /*//Cookie name
      var cookieName_ = 'schedule_week_offset';
      //Reveive cookie value as number
      var weekoffset = $.cookie(cookieName_, Number);
      //Extract offset
      weekoffset = weekoffset == undefined ? 1 : weekoffset + 1;
      //Update offset
      $.cookie(cookieName_, weekoffset);*/
      var url = getURL(weekOffset()+1);
      //goto(getURL(weekoffset), goHash + '+offset');
      urlcheck(className, url);
    }));
  }
}
//Schedule url check

function urlcheck(formclass, url) {
  var w8 = $('<p>Checking Schedule...</p>').insertAfter('form.' + formclass);
  w8.dialog();
  //Running ajax to dertermine if schedule exists
  $.ajax({
    url: url,
    success: function (data) {
      w8.dialog('close');
      //If schedule does not exist, main page (powered by typo3) will be loaded. Continue if is not.
      if (data.substring(324, 356) != 'This website is powered by TYPO3') {
        console.log('Schedule exists.');
        goto(url, goHash + '+offset');
      }
      //Is main page, ask user whether to go to url
       else {
        console.log('Schedule ' + url + 'does not exist.');
        $('<p>').html('Scheudle does not exist!<br> Visit anyway?').appendTo('form.' + formclass).dialog({
          buttons: [
            {
              text: 'No (recommended)',
              click: function () {
                $(this).dialog('close');
              }
            },
            {
              text: 'Yes',
              click: function () {
                $(this).dialog('close');
                parent.location = url;
              }
            }
          ]
        });
      }
    }
  });
}
//Week offset of current page
function weekOffset(){
  if(getLocation().pathname != root + 'welcome.htm'){
    var today = new Date();
    var week = Number.parseInt(getLocation().pathname.split("/").reverse()[1]) - today.getWeekofYear();
    return today.getDay() == 0 || today.getDay() == 6 ? week - 1 : week;
  }
}
// Check whether is welcome page

if (getLocation().pathname == root + 'welcome.htm') {
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
// If is schedule page, display set form
 else {
  setForm();
}
parent.hashchange = function () {
  if (parent.location.hash == goHash) {
    go();
  }
}
