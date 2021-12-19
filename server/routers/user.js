const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const initPassport = require('../middleware/passport')
const { Users } = require('../models')

initPassport(passport)

router.post('/register', async (req, res) => {
    const { username, password, confirm } = req.body
    const User = await Users.findOne({ where: { username: username } })
    if (User) {
        res.json({ message: 'Username is already existed', result: 'faild', field: 'err-usr' })
    } else {
        if (password !== confirm) {
            res.json({ message: 'Password do not matched', result: 'faild', field: 'err-pwd' })
        } else {
            const hashed = await bcrypt.hash(password, 10) 
            try {
                Users.create({ username: username, password: hashed }).then((resp) => res.json({ result: 'success', message: 'User has created', field: null }))
            } catch (error) {
                res.json({ result: 'faild', message: 'Faild to create user', field: null })
            }
        }
        
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, msg) => {
        if (err) throw err
        if (!user) {
            res.send(msg)
        } else {
            req.logIn(user, (err) => {
                if (err) throw err
                res.send({result: 'success', message: 'Logged In'})
            })
        }
    })(req, res, next)
})

router.get('/user', (req, res) => {
    res.send(req.user)
})

router.post('/logout', (req, res) => {
    req.logOut()
    res.json({ result: 'success' })
})

module.exports = router