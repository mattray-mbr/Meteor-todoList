import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';

class TodosListCtrl {
    constructor() {
        this.tasks = [{
            text: 'This is task 1'
        }, {
            text: 'This is task 2'
        }, {
            text: 'This is task 3'
        }];
    }
}

export default angular.module('todosList', [
    angularMeteor
    ]) //used to seeing this as app
    .component('todosList', { //somewhat simmilar syntax to angular routing
        templateUrl: 'imports/components/todosList/todosList.html',
        controller: TodosListCtrl
    });