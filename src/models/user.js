const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema(
    // Fields
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
            validate: val => {
                if (val.length <= 6) {
                    throw new Error("Password must contain at least 7 charecters");
                }
            },
        },

        email: {
            type: String,
            required: false
        },

        notes: {
            type: Number,
            max: 100000,
            min: 0,
            required: true,
            default: 500
        },

        rank: {
            type: Number,
            max: 100000,
            min: 0,
            required: true,
            default: 1000
        },

        profilePictureIndex: {
            type: Number,
            max: 100,
            min: 0,
            required: true,
            default: 0
        },

        difficulty: {
            type: Number,
            max: 10,
            min: 0,
            default: 0
        },

        games: {
            trainingMode: {
                easy: {
                    type: Number,
                    default: 0
                },
                medium: {
                    type: Number,
                    default: 0
                },
                hard: {
                    type: Number,
                    default: 0
                }
            },
            onlineMode: {
                wins: {
                    type: Number,
                    default: 0
                },
                loses: {
                    type: Number,
                    default: 0
                }
            },
            tutorial: {}
        },

        admin: {
            type: Boolean,
            default: false
        },

        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]


    }
)

// Methods
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
    );

    return token;
};


// Static methods
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username });

    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    // Excluding fields
    user.password = undefined

    return user;
};

// Hashing password
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});



const User = mongoose.model("User", userSchema)
module.exports = User


