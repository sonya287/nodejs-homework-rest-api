const express = require('express')
const router = express.Router()
const validation = require('./validation')
const {
    register, login, logout, addAvatar, getCurrent, update, verify
} = require('../../../controllers/users')
const quard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')

router.post('/register', validation.createUser, register)
router.post('/login', validation.loginUser, login)
router.post('/logout', quard, logout)

router.get('/current', quard, getCurrent)

router.patch('/subscription', quard, update)
router.patch('/avatars', quard, upload.single('avatar'), validation.avatarUser, addAvatar)

router.get('/verify/:token', verify)

module.exports = router