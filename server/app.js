const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const dotenv = require('dotenv')
const db = require('./models')
const cors = require('cors')

dotenv.config({ path: './.env' })

const app = express()
const port = process.env.PORT

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(session({ resave: true, saveUninitialized: true, secret: process.env.SECRET }))
app.use(cookieParser(process.env.SECRET))
app.use(passport.initialize())
app.use(passport.session())

// Route middleware
app.use('/post', require('./routers/post'))
app.use('/auth', require('./routers/user'))

// db.sequelize.sync().then()

app.listen(port, () => console.log(`Server is running on port ${port}`))

