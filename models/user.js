const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = async function(id){
  try{
    const user = await User.findById(id).exec();
    //console.log(user);
    return user;
  }catch(err){
    console.error('Error fetching user by id:', error);
    throw new Error('Database query failed');
  }
  
}

module.exports.getUserByUsername = async function(username){
  try {
    // Find user by username
    const user = await User.findOne({ username: username }).exec();
    return user;  // Returns the user object or null if not found
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Database query failed');
  }
}

module.exports.addUser = async function(newUser) {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword;
    // Save the user and return the result
    await newUser.save();
    return newUser; // Return the saved user
  } catch (err) {
    throw new Error('Error in adding user: ' + err.message);
  }
};


module.exports.comparePassword = async function (candidatePassword, hash) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, hash);
    return isMatch;
  } catch (err) {
    throw err;  // Let the calling function handle the error
  }
};