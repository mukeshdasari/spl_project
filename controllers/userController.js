const model = require('../models/user');
const Meetup = require('../models/meetup');

exports.new = (req, res)=>{
    res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    if (user.email)
        user.email = user.email.toLowerCase();

    user.save()
    .then(user=> {
        req.flash('success', 'You have successfully registered');
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }
        
        next(err);
    }); 
};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    let password = req.body.password;
    if (email)
        email = email.toLowerCase();

    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'Wrong email address');  
            res.redirect('/users/login');
        } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.session.firstName = user.firstName;
                    req.session.lastName = user.lastName;
                    req.session.interests = user.interests;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
                } else {
                    req.flash('error', 'Wrong password');      
                    res.redirect('/users/login');
                }
            })
            .catch(err => next(err));;     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    model.findById(id) 
    .then(user=>{
        res.render('./user/profile', {user})
    })
    .catch(err=>next(err));
};

exports.editProfile = (req, res, next)=>{
    let id = req.session.user;
    model.findById(id) 
    .then(user=>{
        res.render('./user/editProfile', {user})
    })
    .catch(err=>next(err));
};

exports.updateProfile = (req, res, next)=>{
    let user = req.body;
    let id = req.session.user;
    model.findByIdAndUpdate(id, user, {useFindAndModify: false})
    .then(user=>{
        if(user) {
            req.session.interests = user.interests;
            req.flash('success', 'Profile has been successfully updated');
            res.redirect('/users/profile');
        } else {
            let err = new Error('User not found');
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        next(err);
    });
};

exports.changePassword = (req, res, next)=>{
    res.render('./user/changePassword');
};

exports.updatePassword = (req, res, next)=>{
    let id = req.session.user;
    if (req.body.password !== req.body.confirm_password) {
        req.flash('error', 'New password and confirm password does not match!');      
        res.redirect('back');
    }

    model.findById(id) 
    .then(user=>{
        user.comparePassword(req.body.current_password)
        .then(result=>{
            if(result) {
                user.password = req.body.password;
                user.save(function (err, user) {
                    if (err) {
                        req.flash('error', 'There is some problem in updating the password');
                        res.redirect('back');
                    } else {
                        req.flash('success', 'Your password has been successfully updated');
                        res.redirect('/users/profile');
                    }
                });
            } else {
                req.flash('error', 'Your current password is incorrect!');      
                res.redirect('back');
            }
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
 };



