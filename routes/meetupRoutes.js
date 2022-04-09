const express = require('express');
const router = express.Router();
const controller = require('../controllers/meetupController');
const { isLoggedIn, isHost } = require('../middlewares/auth');
const { validateId, validateMeetup, validateResult } = require('../middlewares/validator'); 

//GET /meetups: send all meetups to the user
router.get('/', controller.index);

//GET /meetups/myMeetups: send all meetups to the user
router.get('/myMeetups', controller.myMeetups);

//GET /meetups/new: send html form for creating a new meetup
router.get('/new', isLoggedIn, controller.new);

//POST /meetups: create a new meetup
router.post('/', isLoggedIn, validateMeetup, validateResult, controller.create);

//GET /meetups/:id: send details of meetup identified by id
router.get('/:id', validateId, controller.show);

//GET /meetups/:id: send html form for editing an existing meetup
router.get('/:id/edit', validateId, isLoggedIn, isHost, controller.edit);

//PUT /meetups/:id: update the meetup identified by id
router.put('/:id', validateId, validateMeetup, validateResult, isLoggedIn, isHost, controller.update);

//POST /meetups/markAttending: user can mark a particular event he/she is interested in attending
router.post('/markAttending', isLoggedIn, controller.markAttending);

//GET /meetups/attendees: list of user attending the meetup
router.get('/attendees/:id', isLoggedIn, controller.viewAttendees);

//DELETE /meetups/:id: delete the meetup identified by id
router.delete('/:id', validateId, isLoggedIn, isHost, controller.delete);

module.exports=router;  