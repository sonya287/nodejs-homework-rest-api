const User = require('./schemas/user')

const findByEmail = async (email) => {
    return await User.findOne({ email })
}

const findById = async (id) => {
    return await User.findOne({ _id: id })
}

const findByVerifyToken = async (verifyToken) => {
    return await User.findOne({ verifyToken })
}

const create = async ({ email, password, subscription, verify, verifyToken }) => {
    const user = new User({ email, password, subscription, verify, verifyToken })
    return await user.save()
}

const updateToken = async (id, token) => {
    return await User.updateOne({ _id: id }, { token })
}

updateVerifyToken = async (id, verify, verifyToken) => {
    return await User.updateOne({ _id: id }, { verify, verifyToken })
}

const updateAvatar = async (id, avatarURL) => {
    return await User.updateOne({ _id: id }, { avatarURL })
}

const updateSubscription = async (id, subscription) => {
    return await User.updateOne({ _id: id }, { subscription })
}

module.exports = {
    findByEmail,
    findById,
    findByVerifyToken,
    create,
    updateToken,
    updateVerifyToken,
    updateAvatar,
    updateSubscription
}