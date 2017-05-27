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
        type: String,
        default: 'images/profilepic/download.jpeg'
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
        pic: {
            type: String
        },
        link: {
            type: String
        }
    },
    bio: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    facebookID: {
        type: String
    },
    //gooogle ids
    googleID: {
        type: String
    },
    linkedinID: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
