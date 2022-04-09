const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'First name is required']},
    lastName: {type: String, required: [true, 'Last name is required']},
    email: { type: String, required: [true, 'Email address is required'], unique: [true, 'This email address has been used'] },
    password: { type: String, required: [true, 'Password is required'] },
    address: {type: String, required: [true, 'Address is required']},
    city: {type: String, required: [true, 'City is required']},
    zip: {type: String, required: [true, 'Zip is required']},
    state: {type: String, required: [true, 'State is required']},
    interests: {type: String, required: [true, 'Interests is required']}
});

userSchema.pre('save', function(next){
  let user = this;
  if (!user.isModified('password'))
      return next();
  bcrypt.hash(user.password, 10)
  .then(hash => {
    user.password = hash;
    next();
  })
  .catch(err => next(error));
});

userSchema.methods.comparePassword = function(inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};

//collection name is meetups in the database
module.exports = mongoose.model('User', userSchema);