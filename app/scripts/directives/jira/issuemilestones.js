/**
 * Wallboard - Tool to improve the productivity of developers.
 * Copyright (C) 2016 ConVista Faktor Zehn GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

angular.module('wallboardApp')
    .directive('jira.issuemilestones', function ($interval, jira, $log) {

        function link(scope, element, attrs) {

            function loadData() {

                scope.list = [];

                var maxPlannedDate = moment().add(parseInt(scope.interval), 'days');

                // load milestone issues
                jira.getIssuesForMilestones(scope.filter, maxPlannedDate.format('YYYY/MM/DD')).get(function (issueResponse) {
                    angular.forEach(issueResponse.issues, function (issue) {

                        // load milestones for milestone issues
                        jira.getMilestone(issue.id, scope.customfieldid, scope.confschemeid).get(function (milestoneResponse) {
                            angular.forEach(milestoneResponse.rows, function (milestone) {

                                var planned = moment(milestone.cell[scope.plannedindex], 'DD/MM/YYYY');

                                // we show only milestones that are not yet finished (have no actual date) and
                                // where the planned date is lower than a future date (i.e. 60 days from today)
                                if (milestone.cell[scope.actualindex].length == 0 && planned.isBefore(maxPlannedDate)) {
                                    scope.list.push({
                                        epicName: issue.fields.summary,
                                        milestoneName: milestone.cell[scope.epickeycolumnindex],
                                        datum: planned
                                    });
                                }

                            });

                        }, function (error) {
                            if (error) {
                                $log.error("Fehler beim Anmelden an Jira!\n" + JSON.stringify(error));
                            }
                        });
                    });

                }, function (error) {
                    if (error) {
                        $log.error("Fehler beim Anmelden an Jira!\n" + JSON.stringify(error));
                    }
                });
            }

            loadData();

            // set default refresh value to 20 minutes
            if (angular.isUndefined(scope.refresh)) {
                scope.refresh = 1200;
            }

            var stopTime = $interval(loadData, scope.refresh * 1000);

            // listen on DOM destroy (removal) event, and cancel the next UI update
            // to prevent updating time ofter the DOM element was removed.
            element.on('$destroy', function () {
                $interval.cancel(stopTime);
            });
        }

        return {
            restrict: 'E',
            templateUrl: 'views/widgets/jira/issuemilestones.html',
            scope: {
                name: '@',
                filter: '@',
                customfieldid: '@',
                interval: '@',
                maxrows: '@',
                epickeycolumnindex: '@',
                plannedindex: '@',
                actualindex: '@',
                confschemeid: '@',
                refresh: '@'
            },
            link: link
        };
    });
