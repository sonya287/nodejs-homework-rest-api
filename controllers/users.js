const jwt = require('jsonwebtoken')
const Users = require('../model/users')
const { HttpCode } = require('../helpers/constants')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET

const register = async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await Users.findByEmail(email)
        if (user) {
            return res
                .status(HttpCode.CONFLICT)
                .json({
                    status: 'error',
                    code: HttpCode.CONFLICT,
                    data: 'Conflict',
                    message: 'Email in use',
                })
        }
        const newUser = await Users.create(req.body)
        return res.status(HttpCode.CREATED).json({
            status: 'success',
            code: HttpCode.CREATED,
            data: {
                email: newUser.email,
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
            status: 'success',
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

const getCurrent = async (req, res, next) => {
    try {
        return res.status(HttpCode.SUCCESS).json({
            status: 'success',
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
            status: 'success',
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

module.exports = { register, login, logout, getCurrent, update }