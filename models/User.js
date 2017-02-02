var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var config = require('../config');
var onetouch = require('../api/onetouch');

// Create authenticated Authy API client
var authy = require('authy')(config.authyApiKey);

// Used to generate password hash
var SALT_WORK_FACTOR = 10;

// Define user model schema
var UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    authyId: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    authyStatus: {
        type: String,
        default: 'unverified'
    }
});

// Middleware executed before save - hash the user's password
UserSchema.pre('save', function(next) {
    var self = this;

    // only hash the password if it has been modified (or is new)
    if (!self.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(self.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            self.password = hash;
            next();
        });
    });

    if (!self.authyId) {
        // Register this user if it's a new user
        authy.register_user(self.email, self.phone, self.countryCode, 
            function(err, response) {
            if(err){
                if(response && response.json) {
                    response.json(err);
                } else {
                    console.error(err);
                }
                return;
            }
            self.authyId = response.user.id;
            self.save(function(err, doc) {
                if (err || !doc) return next(err);
                self = doc;
            });
        });
    };
});

// Test candidate password
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    var self = this;
    bcrypt.compare(candidatePassword, self.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Send a OneTouch request to this user
UserSchema.methods.sendOneTouch = function(cb) {
    var self = this;
    self.authyStatus = 'unverified';
    self.save();

    onetouch.send_approval_request(self.authyId, {
        message: 'Request to Login to Twilio demo app',
        email: self.email
    }, function(err, authyres){
        if (err && err.success != undefined) {
            authyres = err;
            err = null;
        }
        cb.call(self, err, authyres);
    });
};

// Send a 2FA token to this user
UserSchema.methods.sendAuthyToken = function(cb) {
    var self = this;

    authy.request_sms(self.authyId, function(err, response) {
        cb.call(self, err);
    });
};

// Test a 2FA token
UserSchema.methods.verifyAuthyToken = function(otp, cb) {
    var self = this;
    authy.verify(self.authyId, otp, function(err, response) {
        cb.call(self, err, response);
    });
};

// Export user model
module.exports = mongoose.model('User', UserSchema);
