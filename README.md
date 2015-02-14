#MySchedule
This is an script, that enables you to go directly to your schedule from your schedule manager's welcome page.

#Requirements
This application requires Greasemonkey and currently only available for Mozilla Firefox. 

How to install requirements is shown in "Prerequisites" below.

#Prerequisites
To install the Mozilla Firefox go to [Firefox Download Page](https://www.mozilla.org/en-US/firefox/new/) and follow the installer's instructions.

To install Greasemonkey, go to it's [Addon Page](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) and add it to Firefox.

#Install
To install the script, click [here](myschedule.user.js) or open the `myschedule.user.js` with your Firefox. Greasemonky will ask you if you want to install the script, click install, if you want to ;)

Then you are ready to go :)

#Usage
Go to your schedule manager's page. You will see a new text line, that wasn't there before, calling "Not set, please set schedule first.". For the first usage, thats okay.

As next choose your schedule and press the "Set" Button below the schedule table. There should be an alert "Set your schedule to c1", where c1 is the id of your schedule.

Next time you visit the page, you will see a "My Schedule" button instead of the text. Click on it and it will display your schedule, set before. The schedule id is saved via an cookie, so you should allow your schedule manager's cookies, if you have configured to delete cookies or so.

You also can go directly to your schedule if you add `#myschedule` to the URL, than you don't need to click on the button.

#Meta

##Background
I've written this because it was exhausting search the schedule every time. And because I wanted to try GreaseMonkey :)

##Problems
A problem was to get the Week of Year of an date but I've found an [solution on StackOverflow](http://stackoverflow.com/a/6117889)(the minified prototype). The schedule manager's page is made with frames, so the way dealing with getting and setting the (frame) window location is different.

##ToDo
 * Refactor
 * Allow week navigation via hash
 * Multiple schedules (e.g. one for class and another for student schedule, for comparism)
 * Implement Greasemonkey Update
 * Make code object-orientated.

##Done
 * 14.02.2015: Add "show welcome page"

##Changelog
See [commits](https://github.com/criztovyl/myschedule/commits/master).

##License

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

##Author
(c) 2015 Christoph "criztovyl" Schulz. <ch.schulz@joinout.de>

##Links
* [GitHub Repo](https://github.com/criztovyl/myschedule)
* [Author's GitHub](https://github.com/criztovyl)
* [Author's Website](http://joinout.de)
* [Author's Blog](http://criztovyl.joinout.de)
* Application's Page (coming soon...)
