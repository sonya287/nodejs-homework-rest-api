const Joi = require('joi')
const { ValidEmail, HttpCode } = require('../../../helpers/constants')

const { COM, NET, ORG } = ValidEmail

const schemaCreateUser = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: [COM, NET, ORG] } }).required(),
    password: Joi.string().required(),
    subscription: Joi.string().optional(),
})

const schemaLoginUser = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: [COM, NET, ORG] } }).required(),
    password: Joi.string().required(),
})

const validate = (schema, obj, next) => {
    const { error } = schema.validate(obj)
    const customMessage = () => {
        const joiMessage = error.message
        const message = joiMessage.includes('pattern') || joiMessage.includes('valid') || joiMessage.includes('must')
            ? `Input Error: '${error.details[0].path}' is not valid`
            : `Missing required field '${error.details[0].path}'`
        return message
    }
    if (error) {
        return next({
            status: HttpCode.BAD_REQUEST,
            message: customMessage()
        })
    }
    next()
}

module.exports.createUser = (req, res, next) => {
    return validate(schemaCreateUser, req.body, next)
}

module.exports.loginUser = (req, res, next) => {
    return validate(schemaLoginUser, req.body, next)
}