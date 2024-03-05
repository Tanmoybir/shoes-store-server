const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// MeddleWare
app.use(cors())
app.use(express.json())



app.get('/', (req, res) => {
  res.send('Shoes Store Server')
})

app.listen(port, () => {
  console.log(`Shoes Store Server Started on port ${port}`)
})