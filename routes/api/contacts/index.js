const express = require('express')
const router = express.Router()
const validation = require('./validation')
const {
    getAll,
    getById,
    create,
    update,
    updateParams,
    remove
} = require('../../../controllers/contacts')
const quard = require('../../../helpers/guard')

router.get('/', quard, validation.sortContacts, getAll)
router.post('/', quard, validation.postContact, create)

router.get('/:contactId', quard, getById)
router.delete('/:contactId', quard, remove)
router.put('/:contactId', quard, validation.updateContact, update)

router.patch('/:contactId/subscription', quard, updateParams)

module.exports = router