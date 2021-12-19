const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { Users } = require('../models')

const initialize = (passport) => {
    const authUser = async (username, password, done) => {
        const User = await Users.findOne({ where: { username: username } })
        if (User) {
            if (await bcrypt.compare(password, User.password)) {
                return done(null, User)
            } else {
                return done(null, false, { result: 'faild', message: 'Password is incorrect' })
            }
        } else {
            return done(null, false, { result: 'faild', message: 'Username is incorrect' })
        }
    }

    passport.use(new localStrategy({ usernameField: 'username' }, authUser))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        const User = await Users.findOne({ where: { id: id } })
        done(null, User)
    })
}

module.exports = initialize