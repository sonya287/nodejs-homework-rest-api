const app = require('../app')
const db = require('../model/db')

const PORT = process.env.PORT || 3000

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`)
  })
}).catch((error) => {
  console.log(`Server is not running. Error message: ${error.message}`)
  process.exit(1)
})
