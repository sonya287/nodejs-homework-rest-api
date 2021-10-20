const Contact = require('./schemas/contact')

const listContacts = async (userId,
    { sortBy, sortByDesc, sub, limit = '20', page = '1' },
) => {
    const options = sub ? { owner: userId, subscription: `${sub}` } : { owner: userId }
    const results = await Contact.paginate(options, {
        limit,
        page,
        sort: {
            ...(sortBy ? { [`${sortBy}`]: 1 } : {}), ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {})
        },
        populate: {
            path: 'owner',
            select: 'email -_id'
        }
    })
    const { docs: contacts, totalDocs: total } = results
    return { total: total.toString(), limit, page, contacts }
}

const getContactById = async (contactId, userId) => {
    const result = await Contact.findOne({ _id: contactId, owner: userId }).populate({
        path: 'owner',
        select: 'email -_id'
    })
    return result
}

const addContact = async (body) => {
    const result = await Contact.create(body)
    return result
}

const updateContact = async (contactId, body, userId) => {
    const result = await Contact.findByIdAndUpdate(
        { _id: contactId, owner: userId },
        { ...body },
        { new: true }
    )
    return result
}

const removeContact = async (contactId, userId) => {
    const result = await Contact.findOneAndRemove({ _id: contactId, owner: userId })
    return result
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
}