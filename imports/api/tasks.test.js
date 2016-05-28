//testing with mocha chai sinon

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import { Tasks } from './tasks.js';

if (Meteor.isServer) {
    describe('Tasks', () => {
        describe('methods', () => {
            //creating a task with a random userId
            const userId = Random.id();
            let taskId;
            beforEach(() => {
                Tasks.remove({});
                //testing our random task with the remove method
                taskId = Tasks.insert({
                    text: 'test task',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'testUser',
                });
            });

            it('can delete owned task', () => {
                //testing an isolated instance of the task
                const deleteTask = Meteor.server.method_handlers['tasks.remove'];
                //spy?
                const invocation = {
                    userId
                };
                //run using spy
                deleteTask.apply(incovation, [taskId]);
                //checking if we are getting the expected outcome
                assert.equal(Tasks.find().count(),0);
            });
        });
    });
}

