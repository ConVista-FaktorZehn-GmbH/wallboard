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

angular.module('wallboardApp', ["ngRoute", "ngResource", "ui.bootstrap", "uiSwitch", "angularMoment"])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    'configData': function (wconfig) {
                        return wconfig.promise;
                    }
                }
            })
            .when('/project/:projectId', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    'configData': function (wconfig) {
                        return wconfig.promise;
                    }
                }
            })
            .otherwise({
                redirectTo: '/'
            });

    }]);
