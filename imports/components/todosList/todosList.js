import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../api/tasks.js'; //direct connection to the mongo collection without adding code to the server file

class TodosListCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('tasks'); //connects to the isServer part of tasks.js to pull from the db

        this.hideCompleted = false; 

        this.helpers({
            tasks() {
                const selector = {};
                //if hide completed is checked, filter tasks
                if (this.getReactively('hideCompleted')) { //getReactively is a built in meteor helper
                    selector.checked = {
                        $ne: true //not sure what $ne means
                    };
                }
                return Tasks.find(selector, { 
                    sort: {
                        createdAt: -1
                    } //sorts in reverse order
                }); //finds and updates data from the mongo collection
            },
            incompleteCount() { //counts the number of incomplete tasks
                return Tasks.find({
                    checked:  {
                        $ne: true
                    }
                }).count();
            },
            currentUser() {
                return Meteor.user();
            }
        })
    }
    //adds a new task to the db directly from the front end
    addTask(newTask) {
        Meteor.call('tasks.insert', newTask); //calls the insert method from tasks.js in the api folder, so that it is not available on the front end
        this.newTask = ''; //clears the task form
    }
    setChecked(task) {
        Meteor.call('tasks.setChecked', task._id, !task.checked);
    }
    removeTask(task) {
        Meteor.call('tasks.remove', task._id);
    }
    setPrivate(task) {
        Meteor.call('tasks.setPrivate', task._id, !task.private);
    }
}

export default angular.module('todosList', [
    angularMeteor
    ]) //used to seeing this as app
    .component('todosList', { //somewhat simmilar syntax to angular routing
        templateUrl: 'imports/components/todosList/todosList.html', //meteor automatically parses this file and puts it in the body of the main html file
        controller: ['$scope', TodosListCtrl]
    });