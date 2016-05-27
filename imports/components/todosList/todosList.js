import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';

import { Tasks } from '../../api/tasks.js'; //direct connection to the mongo collection without adding code to the server file

class TodosListCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.helpers({
            tasks() {
                return Tasks.find({}, {
                    sort: {
                        createdAt: -1
                    } //sorts in reverse order
                }); //finds and updates data from the mongo collection
            }
        })
    }
    //adds a new task to the db directly from the front end
    addTask(newTask) {
        Tasks.insert({
            text: newTask,
            createdAt: new Date //add whatever properties you want to object, there is no schema defined for the DB
        });
        this.newTask = ''; //clears the task form
    }
}

export default angular.module('todosList', [
    angularMeteor
    ]) //used to seeing this as app
    .component('todosList', { //somewhat simmilar syntax to angular routing
        templateUrl: 'imports/components/todosList/todosList.html', //meteor automatically parses this file and puts it in the body of the main html file
        controller: ['$scope', TodosListCtrl]
    });