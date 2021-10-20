const User = require('../model/user');

const { Schema, model } = require("mongoose");
const { ValidLengthContactName } = require("../config/constant");

const contactSchema = new Schema(
    {
        name: {
            type: String,
            minLength: ValidLengthContactName.MIN_LENGTH_NAME,
            maxLength: ValidLengthContactName.MAX_LENGTH_NAME,
            required: [true, "Set name for contact"],
        },
        surname: {
            type: String,
            minLength: ValidLengthContactName.MIN_LENGTH_NAME,
            maxLength: ValidLengthContactName.MAX_LENGTH_NAME,
            required: [true, "Set surname for contact"],
        },
        email: {
            type: String,
            required: [true, "Set email for contact"],
            unique: true,
        },
        phone: {
            type: String,
            required: [true, "Set phone for contact"],
            unique: true,
        },
        favorite: { type: Boolean, default: false },
        //   createAt: { type: Date, default: Date.now() },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id;
                return ret;
            },
        },
        toObject: { virtuals: true },
    }
);

contactSchema.virtual("fullname").get(function () {
    return `${this.name} ${this.surname}`;
});

const Contact = model("Contact", contactSchema);

module.exports = {
    Contact,
};