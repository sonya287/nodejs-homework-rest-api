const mongoose = require('mongoose')
require('dotenv').config()
const uriDb = process.env.URI_DB

const db = mongoose.connect(uriDb, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

mongoose.connection.on('connected', () => {
    console.log('Database connection successful')
})

mongoose.connection.on('error', (error) => {
    console.log(`Error connecting to database: ${error.message}`)
})

mongoose.connection.on('disconnected', () => {
    console.log('Connection for db was closed')
})

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    console.log('Database connection interrupted')
    process.exit(1)
})

module.exports = db