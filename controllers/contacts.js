const Contacts = require('../model/contacts')
const { HttpCode } = require('../helpers/constants')

const getAll = async (req, res, next) => {
    try {
        const userId = req.user.id
        const contacts = await Contacts.listContacts(userId, req.query)
        return res.status(HttpCode.SUCCESS).json({
            status: 'success',
            code: HttpCode.SUCCESS,
            data: {
                ...contacts,
            }
        })
    } catch (error) {
        next(error)
    }
}

const getById = async (req, res, next) => {
    try {
        const userId = req.user.id
        const contact = await Contacts.getContactById(req.params.contactId, userId)
        if (contact) {
            return res.status(HttpCode.SUCCESS).json({
                status: 'success',
                code: HttpCode.SUCCESS,
                data: {
                    contact,
                }
            })
        } else {
            return res.status(HttpCode.NOT_FOUND).json({
                status: 'error',
                code: HttpCode.NOT_FOUND,
                message: 'Not found'
            })
        }
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    try {
        const userId = req.user.id
        const result = await Contacts.addContact({ ...req.body, owner: userId })
        if (result?._id) {
            return res.status(HttpCode.CREATED).json({
                status: 'success',
                code: HttpCode.CREATED,
                data: {
                    contact: result,
                }
            })
        } else {
            return res.status(HttpCode.BAD_REQUEST).json({
                status: 'error',
                code: HttpCode.BAD_REQUEST,
                message: result
            })
        }
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const userId = req.user.id
        const contact = await Contacts.updateContact(req.params.contactId, req.body, userId)
        if (contact) {
            return res.status(HttpCode.SUCCESS).json({
                status: 'success',
                code: HttpCode.SUCCESS,
                data: {
                    contact,
                },
            })
        } else {
            return res.status(HttpCode.NOT_FOUND).json({
                status: 'error',
                code: HttpCode.NOT_FOUND,
                data: 'Not Found',
            })
        }
    } catch (e) {
        next(e)
    }
}

const updateParams = async (req, res, next) => {
    try {
        const userId = req.user.id
        const contact = await Contacts.updateContact(req.params.contactId, req.body, userId)
        if (contact) {
            return res.status(HttpCode.SUCCESS).json({
                status: 'success',
                code: HttpCode.SUCCESS,
                data: {
                    contact,
                },
            })
        } else {
            return res.status(HttpCode.NOT_FOUND).json({
                status: 'error',
                code: HttpCode.NOT_FOUND,
                data: 'Not Found',
            })
        }
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const userId = req.user.id
        const contact = await Contacts.removeContact(req.params.contactId, userId)
        if (contact) {
            return res.status(HttpCode.SUCCESS).json({
                status: 'success',
                code: HttpCode.SUCCESS,
                message: 'Contact deleted'
            })
        } else {
            return res.status(HttpCode.NOT_FOUND).json({
                status: 'error',
                code: HttpCode.NOT_FOUND,
                message: 'Not found'
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    updateParams,
    remove
}