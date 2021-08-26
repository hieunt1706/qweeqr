const localStrategy = require('passport-local').Strategy
const githubStrategy=require('passport-github').Strategy
const googleStrategy=require('passport-google-oauth20').Strategy
const userModel = require('./user.model')
const bcrypt = require('bcrypt')

module.exports = function(passport) {
    passport.serializeUser(function(user, done){
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    })

    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    async function(email, password, done) {
        const user = await userModel.findOne({ 'email': email})
        if(!user){
            return done(null, false, {message: "No user with that email"})
        }
        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
            return done(null, false, {message: "Password incorrect"})
        } catch (error) {
            return done(error)
        }
    }
    ))
    
    passport.use(new githubStrategy({
        clientID: '15e8f461eed79ff8ba66',
        clientSecret: '2ee4a97a93c661841b6b402264313bd7c81136c2',
        callbackURL: 'http://localhost:3000/user/github/callback'
    },
    async function(accessToken, refreshToken, profile, done){
        console.log(profile)
    }
    ))

    passport.use(new googleStrategy({
        clientID: '78098101311-d0t38pnj7m5s09g36v1t6tmjs49s4qlm.apps.googleusercontent.com',
        clientSecret: 'KiHKK2SlIsXwEt5UdDBm-Y1A',
        callbackURL: 'http://localhost:3000/user/google/callback'
    },
    async function(accessToken, refreshToken, profile, done){
        console.log(profile)
    }
    ))
}