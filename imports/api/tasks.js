import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check'; //user authentication validation

export const Tasks = new Mongo.Collection('tasks');

if(Meteor.isServer) { //this code only runs on the server
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
            $or: [{
                private: {
                    $ne: true
                }
            }, {
                owner: this.userId
            }, ],
        });
    });
}

//contains all methods related to modifying data in the db
Meteor.methods({ 
    'tasks.insert' (text) {
        check(text, String);
        if(!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },

    'tasks.remove' (taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized'); //only the owner can delete a private task
        }
        if(task.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized'); //only the owner can delete a public task
        }

        Tasks.remove(taskId);
    },

    'tasks.setChecked' (taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized'); //only the owner can check off private tasks
        }

        Tasks.update(taskId, {
            $set: {
                checked: setChecked
            }
        });
    },

    'tasks.setPrivate' (taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);
        const task = Tasks.findOne(taskId); //??
        if(task.owner !== Meteor.userId()) { //only the task owner can set to private
            throw new Meteor.Error('not-authorized');
        }
        Tasks.update(taskId, {
            $set: {
                private: setToPrivate
            }
        });
    },
});