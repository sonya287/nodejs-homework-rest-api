const mongoose = require('mongoose')
const { Schema, model } = mongoose
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
require('dotenv').config()
const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR
const { Subscription } = require('../../helpers/constants')

const { FREE, PRO, PREMIUM } = Subscription

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate(value) {
            const isValid = /\S+@\S+\.\S+/
            return isValid.test(String(value).toLowerCase())
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    avatarURL: {
        type: String,
        default: function () {
            return gravatar.url(this.email, { s: '250' }, true)
        }
    },
    token: {
        type: String,
        default: null,
    },
    subscription: {
        type: String,
        enum: [FREE, PRO, PREMIUM],
        default: FREE
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verifyToken: {
        type: String,
        required: [true, 'Verify token is required'],
    }
},
    {
        versionKey: false,
        timestamps: true
    })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    this.password = await bcrypt.hash(this.password, salt, null)
    next()
})

userSchema.methods.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)

module.exports = User