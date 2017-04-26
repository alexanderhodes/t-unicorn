'use strict';
/*eslint no-invalid-this:0*/
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  email: String,
  name: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      email: this.email
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      _id: this._id
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('name')
  .validate(function(value, respond) {
    return this.constructor.findOne({ name: value }).exec()
      .then(user => {
        if(user) {
          if(this.id === user.id) {
            return respond(true);
          }
          return respond(false);
        }
        return respond(true);
      })
      .catch(function(err) {
        throw err;
      });
  }, 'The specified username address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    // Handle new/update passwords
    if(!this.isModified('password')) {
      return next();
    }

    if(!validatePresenceOf(this.password)) {
      return next(new Error('Invalid password'));
    }

    this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
      if(encryptErr) {
        return next(encryptErr);
      }
      this.password = hashedPassword;
      return next();
    });
  });

/**
 * Encrypt password
 *
 * @param {String} password
 * @param {Function} callback
 * @return {String}
 * @api public
 */
UserSchema.methods.encryptPassword = function (password, callback){

  if(!password) {
    if(!callback) {
      return null;
    } else {
      return callback('Missing password');
    }
  }

  if(!callback) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
  }
  try {
    return callback (null, bcrypt.hashSync(password, bcrypt.genSaltSync(9)));
  } catch (err) {
    return callback (err)
  }
};

/**
 * Authenticate - check if the passwords are the same
 *
 * @param {String} password
 * @param {Function} callback
 * @return {Boolean}
 * @api public
 */
UserSchema.methods.authenticate = function (password, callback){

  if(!callback) {
    return bcrypt.compareSync(password, this.password);
  } else {
    return callback(null, bcrypt.compareSync(password, this.password));
  }
};

export default mongoose.model('User', UserSchema);
