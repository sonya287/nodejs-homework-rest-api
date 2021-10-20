const Joi = require('joi')
const { Subscription, ValidEmail, HttpCode, SortFields } = require('../../../helpers/constants')

const { COM, NET, ORG } = ValidEmail
const { NAME, EMAIL, PHONE } = SortFields
const { FREE, PRO, PREMIUM } = Subscription
const regEmail = /^[a-zA-Z]+(?:[\s.]+[a-zA-Z]+)*$/

const schemaPostContact = Joi.object({
    name: Joi.string().min(3).max(20).pattern(regEmail).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: [COM, NET, ORG] } }).required(),
    phone: Joi.string().required(),
})

const schemaUpdateContact = Joi.object({
    name: Joi.string().min(3).max(20).pattern(regEmail).optional(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: [COM, NET, ORG] } }).optional(),
    phone: Joi.string().optional(),
})

const validateContactParametres = (schema, obj, next) => {
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

const schemaSortContacts = Joi.object({
    limit: Joi.string().optional(),
    page: Joi.string().optional(),
    sortBy: Joi.string().valid(NAME, EMAIL, PHONE).optional(),
    sortByDesc: Joi.string().valid(NAME, EMAIL, PHONE).optional(),
    sub: Joi.string().valid(FREE, PRO, PREMIUM).optional()
})

const validateSortParametres = (schema, obj, next) => {
    const { error } = schema.validate(obj)
    if (error) {
        return next({
            status: HttpCode.BAD_REQUEST,
            message: 'Wrong fields of sort'
        })
    }
    next()
}

module.exports.postContact = (req, res, next) => {
    return validateContactParametres(schemaPostContact, req.body, next)
}

module.exports.updateContact = (req, res, next) => {
    return validateContactParametres(schemaUpdateContact, req.body, next)
}

module.exports.sortContacts = (req, res, next) => {
    return validateSortParametres(schemaSortContacts, req.query, next)
}