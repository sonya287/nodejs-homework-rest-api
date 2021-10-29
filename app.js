const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')

const app = express()

require('dotenv').config()
const SAVE_DIR = process.env.SAVE_DIR

const usersRouter = require('./routes/api/users')
const contactsRouter = require('./routes/api/contacts')
app.use(express.static(path.join(__dirname, SAVE_DIR)))
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message })
})

module.exports = app
