const {body} = require('express-validator');
const{validationResult} = require('express-validator');

//check if the route parameter is valid ObjectId type value
exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    if(id.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error('Invalid meetup id');
        err.status = 400;
        return next(err);
    }
};

exports.validateSignUp = [
    body('firstName','First name is required' ).notEmpty().trim().escape(), 
    body('lastName','Last name is required').notEmpty().trim().escape(),
    body('email','Email is required').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 10 characters and at most 60 characters').isLength({min:10, max:60}),
    body('address','Address is required').notEmpty().trim().escape(),
    body('city','City is required').notEmpty().trim().escape(),
    body('zip','Zip is required').notEmpty().trim().escape(),
    body('state','State is required').notEmpty().trim().escape(),
    body('interests','Interst is required').notEmpty().trim().escape()
];

exports.validateLogIn = [
    body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 10 characters and at most 60 characters').isLength({min:10, max:60})
];

exports.validateUpdateProfile = [
    body('firstName','First name is required' ).notEmpty().trim().escape(), 
    body('lastName','Last name is required').notEmpty().trim().escape(),
    body('address','Address is required').notEmpty().trim().escape(),
    body('city','City is required').notEmpty().trim().escape(),
    body('zip','Zip is required').notEmpty().trim().escape(),
    body('state','State is required').notEmpty().trim().escape(),
    body('interests','Interst is required').notEmpty().trim().escape()
];

exports.validateUpdatePassword = [
    body('current_password', 'Current password is required').notEmpty(), 
    body('password', 'New password must be at least 10 characters and at most 60 characters').isLength({min:10, max:60}),
    body('confirm_password', 'Confirm password must be at least 10 characters and at most 60 characters').isLength({min:10, max:60})
];

exports.validateMeetup = [
    body('topic','Topic is required').notEmpty().trim().escape(),
    body('name','Name is required').notEmpty().trim().escape(),
    body('interests','Interests is required').notEmpty().trim().escape(),
    body('details','Details is required').notEmpty().trim().escape(),
    body('location','Location is required').notEmpty().trim().escape(),
    body('date','Date is required').notEmpty().trim().escape(),
    body('startTime','Start Time is required').notEmpty().trim().escape(),
    body('endTime','End Time is required').notEmpty().trim().escape(),
    body('image','Image is required').notEmpty().trim()
];

exports.validateResult = (req, res, next) =>{
    let errors = validationResult(req);
    if (!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash ('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}