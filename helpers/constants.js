const Subscription = {
    FREE: 'free',
    PRO: 'pro',
    PREMIUM: 'premium',
}

const ValidEmail = {
    COM: 'com',
    NET: 'net',
    ORG: 'org'
}

const HttpCode = {
    SUCCESS: '200',
    CREATED: '201',
    NO_CONTENT: '204',
    BAD_REQUEST: '400',
    UNAUTHORIZED: '401',
    FORBIDDEN: '403',
    NOT_FOUND: '404',
    CONFLICT: '409',
    INTERNAL_SERVER_ERROR: '500',
}

const SortFields = {
    NAME: 'name',
    EMAIL: 'email',
    PHONE: 'phone'
}

const StatusMessage = {
    SUCCESS: 'success',
    ERROR: 'error'
}

const emailAddress = 'snowflakes197@outlook.com'

module.exports = { Subscription, ValidEmail, HttpCode, SortFields }