const app = require('../app')
const db = require('../model/db')
const createFolderIsExist = require('../helpers/create-dir')
require('dotenv').config()

const PORT = process.env.PORT || 3000

db.then(() => {
  app.listen(PORT, async () => {
    const UPLOAD_DIR = process.env.UPLOAD_DIR
    const SAVE_DIR = process.env.SAVE_DIR
    await createFolderIsExist(UPLOAD_DIR)
    await createFolderIsExist(SAVE_DIR)
    console.log(`Server is not runnig. Use our API on port: ${PORT}`)
  })
}).catch((error) => {
  console.log(`Server is not running. Error message: ${error.message}`)
  process.exit(1)
})
