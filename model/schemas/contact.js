const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose
const mongoosePaginate = require('mongoose-paginate-v2')
const { Subscription } = require('../../helpers/constants')

const { FREE, PRO, PREMIUM } = Subscription

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set a name for your contact'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Set an email for your contact']
    },
    phone: {
        type: String,
        required: [true, 'Set a phone number for your contact']
    },
    subscription: {
        type: String,
        enum: [FREE, PRO, PREMIUM],
        default: FREE
    },
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
    }
},
    {
        versionKey: false,
        timestamps: true
    })

contactSchema.plugin(mongoosePaginate)
const Contact = model('contact', contactSchema)

module.exports = Contact