import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose, { now } from 'mongoose'

const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log (`listening on port: ${port}`)
})

// mongoose.connect(process.env.DATABASE_URL)

app.get('/', (req,res) => {
  res.json({message: "Server running"})
})