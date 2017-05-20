const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String
    },
    name: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    profilepic: {
        type: String
    },
    language: [String],
    lookingforjob: {
        type: Boolean
    },
    following: {
        type: String
    },
    follower: {
        type: String
    },
    connection: {
        type: String
    },
    portafolio: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

module.exports = userSchema;
