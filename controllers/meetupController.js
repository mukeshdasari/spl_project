const Meetup = require('../models/meetup');
const User = require('../models/user');
const { DateTime } = require("luxon");
const model = require('../models/user');

exports.index = (req, res, next) => {
    let interests = 'All';
    let search = '';
    let queryParams = {};

    if (req.query.search){
        search = req.query.search;
    }
    if (req.query.interests){
        interests = req.query.interests;
    }else{
        interests = req.session.interests;
    }

    if(interests=='All' && search.length>0){
        //queryParams = {name: {$regex: search, $options: 'i'}};
        queryParams = {'$or':[{name:{$regex: search, $options: 'i'}},{topic:{$regex: search, $options: 'i'}}]};

    }else if(interests!='All' && search.length>0){
        //queryParams = {interests: interests, name: {$regex: search, $options: 'i'}};
        queryParams = {interests: interests, '$or':[{name:{$regex: search, $options: 'i'}},{topic:{$regex: search, $options: 'i'}}]};

    }else if(interests!='All' && search.length==0){
        queryParams = {interests: interests};

    }
    
    Meetup.find(queryParams).populate('host', 'firstName lastName')
        .then(meetups => {
            res.render('./meetup/index', {meetups, interests, search})
        })
        .catch(err=>next(err));
};

exports.new = (req, res) => {
    res.render('./meetup/new');
};

exports.create = (req, res, next) => {
    let meetup = new Meetup(req.body);
    meetup.host  = req.session.user;
    meetup.save()
    .then(meetup=> {
        req.flash('success', 'You have successfully created a new meetup');
        res.redirect('/meetups');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            next(err);
        }
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;

    var attendingMeetup=false;
    Meetup.findOne({_id: id}, function(error, user){
        var isInArray = user.attendees.some(function (attendee) {
            return attendee.equals(req.session.user);
        });
        if(isInArray){
            attendingMeetup=true;
        }
    });

    Meetup.findById(id).populate('host', 'firstName lastName')
    .then(meetup=>{
        if(meetup) {
            meetup.date = DateTime.fromSQL(meetup.date).toFormat('LLLL dd, yyyy');
            meetup.startTime = DateTime.fromSQL(meetup.startTime).toFormat('hh:mm a');
            meetup.endTime = DateTime.fromSQL(meetup.endTime).toFormat('hh:mm a');
            return res.render('./meetup/show', {meetup,attendingMeetup});
        } else {
            let err = new Error('Cannot find a meetup with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    Meetup.findById(id)
    .then(meetup=>{
        if(meetup) {
            return res.render('./meetup/edit', {meetup});
        } else {
            let err = new Error('Cannot find a meetup with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next) => {
    let meetup = req.body;
    let id = req.params.id;
    Meetup.findByIdAndUpdate(id, meetup, {useFindAndModify: false, runValidators: true})
    .then(meetup=>{
        if(meetup) {
            req.flash('success', 'Meetup has been successfully updated');
            res.redirect('/meetups/'+id);
        } else {
            let err = new Error('Cannot find a meetup with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            next(err);
        }
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    Meetup.findByIdAndDelete(id, {useFindAndModify: false})
    .then(meetup =>{
        if(meetup) {
            res.redirect('/meetups');
        } else {
            let err = new Error('Cannot find a meetup with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};

exports.myMeetups = (req, res, next)=>{
    let id = req.session.user;
    Meetup.find({host: id})
    .then(meetups=>{
        res.render('./meetup/myMeetups', {meetups})
    })
    .catch(err=>next(err));
};

exports.markAttending = (req, res, next) => { 
    let id = req.body.id;

    Meetup.findOne({_id: id}, function(error, user){
        var isInArray = user.attendees.some(function (attendee) {
            return attendee.equals(req.session.user);
        });

        if(isInArray && !(req.body.attendees)){
            Meetup.findByIdAndUpdate(id, { "$pull": { attendees: req.session.user } }, {useFindAndModify: false})
            .then(meetup=>{
                if(meetup){
                    req.flash('success', 'You have removed your attendance from this meetup');
                    res.redirect('/meetups/'+id);
                }else{
                    req.flash('error', 'There is some problem in removing the attendance from this meetup');      
                    res.redirect('back');
                }
            })
            .catch(err=>next(err));
            
        }else if(isInArray && req.body.attendees){
            req.flash('error', 'You are already attending this meetup');      
            res.redirect('back');

        }else{
            Meetup.findByIdAndUpdate(id, { $push: {attendees: req.session.user}}, { new: true, useFindAndModify: false})
            .then(meetup=>{
                if(meetup){
                    req.flash('success', 'You have marked your attendance in this meetup');
                    res.redirect('/meetups/'+id);
                }else{
                    req.flash('error', 'There is some problem in marking the attendance in the meetup');      
                    res.redirect('back');
                }
            })
            .catch(err=>next(err));

        }
    });
};

exports.viewAttendees = (req, res, next) => {
    let id = req.params.id;
    Meetup.findById(id).populate('attendees')
    .then(meetup => {
        var attendees = meetup.attendees
        res.render('./meetup/attendees', {meetup, attendees})
    })
    .catch(err=>next(err));
};