const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');
const {validateSignUp, validateLogIn, validateUpdateProfile, validateUpdatePassword, validateResult} = require('../middlewares/validator');

const router = express.Router();

//GET /users/new: send html form for creating a new user account

router.get('/new', isGuest, controller.new);

//POST /users: create a new user account

router.post('/', isGuest, validateSignUp, validateResult, controller.create);

//GET /users/login: send html for logging in
router.get('/login', isGuest, controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post('/login', isGuest, validateLogIn, validateResult, controller.login);

//GET /users/profile: send user's profile page
router.get('/profile', isLoggedIn, controller.profile);

//GET /users/profile/edit: send user's edit profile page
router.get('/profile/edit', isLoggedIn, controller.editProfile);

//POST /users/profile/edit: updates user profile
router.post('/profile/edit', isLoggedIn, validateUpdateProfile, validateResult, controller.updateProfile);

//GET /users/profile: send user to change password page
router.get('/profile/change-password', isLoggedIn, controller.changePassword);

//POST /users/profile/change-password: updates user password
router.post('/profile/change-password', isLoggedIn, validateUpdatePassword, validateResult, controller.updatePassword);

//POST /users/logout: logout a user
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;