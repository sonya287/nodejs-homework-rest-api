const express = require('express')
const router = express.Router()
const validation = require('./validation')
const {
    register, login, logout, getCurrent, update
} = require('../../../controllers/users')
const quard = require('../../../helpers/guard')

router.post('/register', validation.createUser, register)
router.post('/login', validation.loginUser, login)
router.post('/logout', quard, logout)

router.get('/current', quard, getCurrent)

router.patch('/subscription', quard, update)

module.exports = router