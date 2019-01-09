const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true, require: true, trim: true },
  pwd: { type: String, require: true },
  admin: Boolean,
});

/* Hashing password */
UserSchema.pre('save', function(next) {
  const user = this;
  const saltFactor = parseInt(process.env.SALT_ROUND);
  bcrypt.genSalt(saltFactor, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.pwd, salt, (err, hash) => {
      if (err) return next(err);
      user.pwd = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(userPassword, cb) {
  bcrypt.compare(userPassword, this.pwd, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('user', UserSchema);
