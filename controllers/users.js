const jwt = require('jsonwebtoken')
const fs = require('fs').promises
const path = require('path')
const Jimp = require('jimp')
const { nanoid } = require('nanoid')
const Users = require('../model/users')
const { HttpCode, StatusMessage } = require('../helpers/constants')
const EmailService = require('../services/email')
const createFolderIsExist = require('../helpers/create-dir')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET

const register = async (req, res, next) => {
    try {
        const { email, name } = req.body
        const user = await Users.findByEmail(email)
        if (user) {
            return res
                .status(HttpCode.CONFLICT)
                .json({
                    status: StatusMessage.ERROR,
                    code: HttpCode.CONFLICT,
                    message: 'Email in use',
                })
        }
        const verifyToken = nanoid()
        const emailService = new EmailService(process.env.NODE_ENV)
        await emailService.sendEmail(verifyToken, email, name)
        const newUser = await Users.create({
            ...req.body,
            verify: false,
            verifyToken,
        })
        return res.status(HttpCode.CREATED).json({
            status: StatusMessage.SUCCESS,
            code: HttpCode.CREATED,
            data: {
                email: newUser.email,
                avatarURL: newUser.avatarURL,
                subscription: newUser.subscription
            }
        })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await Users.findByEmail(email)
        const isPasswordValid = await user.validPassword(password)
        if (!user || !isPasswordValid) {
            return res
                .status(HttpCode.UNAUTHORIZED)
                .json({
                    status: 'error',
                    code: HttpCode.UNAUTHORIZED,
                    data: 'Unauthorized',
                    message: 'Email or password is wrong',
                })
        }
        const id = user._id
        const payload = { id }
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
        await Users.updateToken(id, token)
        return res.status(HttpCode.SUCCESS).json({
            status: StatusMessage.SUCCESS,
            code: HttpCode.SUCCESS,
            data: {
                token,
                user: {
                    email,
                    subscription: user.subscription,
                }
            }
        })
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    const id = req.user.id
    await Users.updateToken(id, null)
    return res.status(HttpCode.NO_CONTENT).json()
}

const addAvatar = async (req, res, next) => {
    try {
        const id = await req.user.id
        const SAVE_DIR = process.env.SAVE_DIR
        const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
        const pathFile = req.file.path
        const newPathFile = path.join(SAVE_DIR, AVATARS_OF_USERS)
        const newAvatarName = `${Date.now()}-${req.file.originalname}`
        const img = await Jimp.read(pathFile)
        await img
            .autocrop()
            .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
            .writeAsync(pathFile)

        await createFolderIsExist(newPathFile)
        await createFolderIsExist(path.join(newPathFile, id))
        await fs.rename(pathFile, path.join(newPathFile, id, newAvatarName))
        const avatarUrl = path.normalize(path.join(AVATARS_OF_USERS, id, newAvatarName))
        try {
            await fs.unlink(path.join(process.cwd(), SAVE_DIR, req.user.avatarURL))
        } catch (e) {
            console.log(e.message)
        }
        await Users.updateAvatar(id, avatarUrl)
        return res.json({
            status: StatusMessage.SUCCESS,
            code: HttpCode.SUCCESS,
            data: {
                avatarUrl
            }
        })
    } catch (e) {
        next(e)
    }
}

const getCurrent = async (req, res, next) => {
    try {
        return res.status(HttpCode.SUCCESS).json({
            status: HttpCode.SUCCESS,
            code: HttpCode.SUCCESS,
            data: {
                user: {
                    email: req.user.email,
                    subscription: req.user.subscription,
                }
            }
        })
    } catch (error) {
        next(error)
    }
}


const update = async (req, res, next) => {
    try {
        const id = req.user.id
        const { subscription } = req.body
        await Users.updateSubscription(id, subscription)
        return res.status(HttpCode.SUCCESS).json({
            status: HttpCode.SUCCESS,
            code: HttpCode.SUCCESS,
            data: {
                user: {
                    email: req.user.email,
                    subscription,
                }
            }
        })
    } catch (error) {
        next(error)
    }
}

const verify = async (req, res, next) => {
    try {
        const user = await Users.findByVerifyToken(req.params.token)
        if (user) {
            await Users.updateVerifyToken(user.id, true, null)
            return res.json({
                status: StatusMessage.SUCCESS,
                code: HttpCode.OK,
                message: 'Verification successful!',
            })
        }
        return res.status(HttpCode.NOT_FOUND).json({
            status: StatusMessage.SUCCESS,
            code: HttpCode.NOT_FOUND,
            message: 'Link is not valid',
        })
    } catch (e) {
        next(e)
    }
}

module.exports = { register, login, logout, addAvatar, getCurrent, update }