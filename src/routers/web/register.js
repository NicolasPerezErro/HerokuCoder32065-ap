import { Router } from 'express'

import __dirname from '../../../__dirname.js'
import path from 'path';

import passport from 'passport';
import bCrypt from 'bcrypt';

import { Strategy as LocalStrategy } from 'passport-local';

import User from '../../models.js'

import logger from '../../../logger/logger.js'

const signup = path.join(__dirname, '/public/', 'signup.html')

const registerWebRouter = new Router()

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
    (req, username, password, done) => {
        User.findOne({ 'username': username }, (err, user) => {
            if (err) {
                return done(err);
            };

            if (user) {
                return done(null, false);
            }

            const newUser = {
                username: username,
                password: createHash(password)
            };

            User.create(newUser, (err, userWithId) => {
                if (err) {
                    return done(err);
                }
                return done(null, userWithId);
            })
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});

function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

// servicios

registerWebRouter.get('/signup', (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`)
    res.sendFile(signup)
})

registerWebRouter.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/signupFail'
}), (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`)
    res.redirect('/')
})

registerWebRouter.get('/signupFail', (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`)
    res.render('signup-error')
})

export default registerWebRouter